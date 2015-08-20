/*
 * @license Angular-DateRangePicker-Enhanced v0.1.20
 */
(function() {
  var picker;

  picker = angular.module('daterangepicker', []);

  picker.value('dateRangePickerConfig', {
    separator: ' - ',
    format: 'YYYY-MM-DD'
  });

  picker.directive('dateRangePicker', ['$log', '$compile', '$timeout', '$parse', 'dateRangePickerConfig', function($log, $compile, $timeout, $parse, dateRangePickerConfig) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        dateMin: '=min',
        dateMax: '=max',
        model: '=ngModel',
        opts: '=options'
      },
      link: function($scope, element, attrs, modelCtrl) {
        var customOpts, el, opts, _formatted, _init, _picker, _validateMax, _validateMin, _format;
        el = $(element);
        customOpts = $scope.opts;
        opts = angular.extend({}, dateRangePickerConfig, customOpts);

        _validateMin = function(min, start) {
          var valid;
          min = moment(min);
          start = moment(start);
          valid = min.isBefore(start) || min.isSame(start, 'day');
          modelCtrl.$setValidity('min', valid);
          return valid;
        };
        _validateMax = function(max, end) {
          var valid;
          max = moment(max);
          end = moment(end);
          valid = max.isAfter(end) || max.isSame(end, 'day');
          modelCtrl.$setValidity('max', valid);
          return valid;
        };
        modelCtrl.$parsers.push(function(val) {
          if ($scope.dateMin && val.startDate) {
            _validateMin($scope.dateMin, val.startDate);
          } else {
            modelCtrl.$setValidity('min', true);
          }
          if ($scope.dateMax && val.endDate) {
            _validateMax($scope.dateMax, val.endDate);
          } else {
            modelCtrl.$setValidity('max', true);
          }
          return $.trim(el.val());
        });
        modelCtrl.$formatters.push(function(val) {
          if (val) {
            return _format(val);
          }

          return val;
        });
        modelCtrl.$isEmpty = function(val) {
          return !val || (val.startDate === null || val.endDate === null);
        };
        modelCtrl.$render = function() {
          if (!modelCtrl.$viewValue) {
            if (modelCtrl.$modelValue) {
              return el.val(_format(modelCtrl.$modelValue));
            }
            return el.val('');
          }
          if (angular.isObject(modelCtrl.$viewValue)) {
            return el.val(_format(modelCtrl.$viewValue));
          }
          return el.val(modelCtrl.$viewValue);
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

        _init = function() {
          return el.daterangepicker(opts, function(start, end, label) {
            modelCtrl.$setViewValue({
              startDate: start,
              endDate: end
            });
            return modelCtrl.$render();
          });
        };
        _init();
        if (attrs.min) {
          $scope.$watch('dateMin', function(date) {
            if (date) {
              if (!modelCtrl.$isEmpty(modelCtrl.$modelValue)) {
                _validateMin(date, modelCtrl.$modelValue.startDate);
              }
              opts.minDate = moment(date);
            } else {
              opts.minDate = false;
            }
            return _init();
          });
        }
        if (attrs.max) {
          $scope.$watch('dateMax', function(date) {
            if (date) {
              if (!modelCtrl.$isEmpty(modelCtrl.$modelValue)) {
                _validateMax(date, modelCtrl.$modelValue.endDate);
              }
              opts.maxDate = moment(date);
            } else {
              opts.maxDate = false;
            }
            return _init();
          });
        }
        if (attrs.options) {
          $scope.$watch('opts', function(newOpts) {
            opts = angular.extend(opts, newOpts);
            return _init();
          });
        }
        return $scope.$on('$destroy', function() {
          //return _picker.remove();
        });
      }
    };
  }]);

}).call(this);
