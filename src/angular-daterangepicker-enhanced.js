/*
 * @license Angular-DateRangePicker-Enhanced v0.1.24
 */
(function() {
  var picker;

  picker = angular.module('daterangepicker', []);

  picker.value('dateRangePickerConfig', {
    separator: ' - ',
    format: 'YYYY-MM-DD', 
    autoUpdateInput: false
  });

  picker.directive('dateRangePicker', ['$timeout', '$parse', 'dateRangePickerConfig', function($timeout, $parse, dateRangePickerConfig) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        opts: '=options'
      },
      link: function($scope, element, attrs, modelCtrl) {
        var customOpts, el, opts, _format;
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
          var date = angular.extend({}, modelCtrl.$viewValue, modelCtrl.$modelValue);
          if(date.startDate) {
            el.val(_format(date));
          }
          return el.daterangepicker(opts, function(start, end, label) {
            $timeout(function() {
             var obj =  {
                startDate: start,
                endDate: end
              };
              el.val(_format(obj));
              return obj;
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
        el.on('keyup', function () {
          if(_.trim(el.val()) === '') {
            modelCtrl.$setViewValue({'startDate': null, 'endDate': null});
          }else {
             var m = moment(el.val());
             if(m.isValid()) {
                modelCtrl.$setViewValue({'startDate': m, 'endDate': m});
             }
          }
        });
      }
    };
  }]);

}).call(this);

