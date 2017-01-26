(function () {
  "use strict";

  angular
    .module("seismic-retrofit", ["ngTable"])
    .component("seismicRetrofit", {
      controller: [
        "filterFilter",
        "$http",
        "$window",
        "NgTableParams",
        seismicRetrofit
      ],
      templateUrl: "seismic-retrofit.html"
    });

    function seismicRetrofit (filter, $http, $window, NgTableParams) {
      var ctrl = this;

      ctrl.$onInit = function () {
        $http.get("data.json", { cache: true }).then(function (results) {
          ctrl.data = results.data;
        });
      };

      ctrl.download = function(ext) {
        $window.open("data" + ext);
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

          var addressMatches = filter(ctrl.data, { address: ctrl.q });
          var apnMatches = filter(ctrl.data, { apn: ctrl.q });
          var uniqueMatches = unique(addressMatches.concat(apnMatches), "apn");

          if (uniqueMatches.length > 0) {
            ctrl.tableParams = new NgTableParams(
              { sorting: { build_type: "asc" } },
              { dataset: uniqueMatches }
            );
            ctrl.show = true;
          }
          else {
            ctrl.msg = "No results matched your search";
          }
        }
      };

      ctrl.view = function () {
        ctrl.tableParams = new NgTableParams(
          { sorting: { building_type: "asc" } },
          { dataset: ctrl.data }
        );
        ctrl.show = true;
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
