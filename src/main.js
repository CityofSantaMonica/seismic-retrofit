(function () {
  "use strict";

  angular
    .module("seismic-retrofit", ["ngTable"])
    .component("seismicRetrofit", {
      bindings: {
        root: "@",
      },
      controller: ["filterFilter", "$http", "NgTableParams", seismicRetrofit],
      template: '<ng-include src="$ctrl.templateUrl"></ng-include>'
    });

    function seismicRetrofit (filter, $http, NgTableParams) {
      var ctrl = this;

      ctrl.$onInit = function () {
        ctrl.q = "";
        ctrl.templateUrl = ctrl.root + "seismic-retrofit.html";
        $http.get(ctrl.root + "data.json", { cache: true }).then(function (results) {
          ctrl.data = results.data;
        });
      };

      ctrl.keypress = function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          ctrl.search();
        }
      };

      ctrl.reset = function() {
        ctrl.msg = "";
        ctrl.q = "";
        ctrl.show = false;
        ctrl.tableParams = new NgTableParams();
      }

      ctrl.search = function() {
        if (ctrl.q !== "") {
          ctrl.show = false;

          var q = ctrl.q.replace(/[^\w\s]/g, "")
                        .replace(/avenue/i, "ave")
                        .replace(/boulevard/i, "blvd")
                        .replace(/court/i, "ct")
                        .replace(/drive/i, "dr")
                        .replace(/place/i, "pl")
                        .replace(/street(?!\spromenade)/i, "st")
                        .replace(/terrace/i, "ter");

          var addressMatches = filter(ctrl.data, { address: q });
          var apnMatches = filter(ctrl.data, { apn: q });
          var uniqueMatches = unique(addressMatches.concat(apnMatches), "apn");

          if (uniqueMatches.length > 0) {
            ctrl.tableParams = new NgTableParams(
              { sorting: { build_type: "asc" }, count: uniqueMatches.length },
              { dataset: uniqueMatches, counts: [] }
            );
            ctrl.show = true;
          }
          else {
            ctrl.msg = "No results matched your search";
          }
        }
      };

      var unique = function(records, property) {
        var seen = {}, output = [];
        for (var i = 0; i < records.length; i++) {
            if (seen.hasOwnProperty(records[i][property])) continue;
            seen[records[i][property]] = true;
            output.push(records[i]);
        }
        return output;
      };
    }
})();
