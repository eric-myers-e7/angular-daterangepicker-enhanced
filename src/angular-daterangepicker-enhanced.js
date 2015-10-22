/*
 * @license Angular-DateRangePicker-Enhanced v0.1.23
 */
(function() {
  var picker;

  picker = angular.module('daterangepicker', []);

  picker.value('dateRangePickerConfig', {
    separator: ' - ',
    format: 'YYYY-MM-DD'
  });

  picker.directive('dateRangePicker', ['$timeout', '$parse', 'dateRangePickerConfig', function($timeout, $parse, dateRangePickerConfig) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        opts: '=options'
      },
      link: function($scope, element, attrs, modelCtrl) {
        var customOpts, el, opts, _init, _format;
        el = $(element);
        customOpts = $scope.opts;
        opts = angular.extend({}, dateRangePickerConfig, customOpts);

        modelCtrl.$parsers.push(function(val) {
          if (!angular.isObject(val) || !(val.hasOwnProperty('startDate') && val.hasOwnProperty('endDate'))) {
              return modelCtrl.$modelValue;
          }
          return val;
        });

        modelCtrl.$parsers.push(function(val) {
          return val;
        });

        modelCtrl.$render = function() {
          opts = angular.extend({}, opts, modelCtrl.$viewValue, modelCtrl.$modelValue);
          return el.daterangepicker(opts, function(start, end, label) {
            $timeout(function() {
              return {
                startDate: start,
                endDate: end
              };
            }).then(function(obj) {
              modelCtrl.$setViewValue(obj);
            });
          });
        };
        _format = function(obj) {
          if (!angular.isObject(obj.startDate)) {
            obj.startDate = moment(obj.startDate);
            obj.endDate = moment(obj.endDate);
          }
          var date = obj.startDate.format(opts.format);
          if (!opts.singleDatePicker) {
            date += ' - ' + obj.endDate.format(opts.format);
          }
          return date;
        };

        if (attrs.options) {
          $scope.$watch('opts', function(newOpts) {
            opts = angular.extend(opts, newOpts);
            // return _init();
          });
        }

        return $scope.$on('$destroy', function() {
          //return _picker.remove();
        });
      }
    };
  }]);

}).call(this);

