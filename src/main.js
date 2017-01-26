(function () {
  "use strict";

  angular
    .module("seismic-retrofit", ["ngTable"])
    .component("seismicRetrofit", {
      controller: ["filterFilter", "$http", "NgTableParams", seismicRetrofit],
      templateUrl: "seismic-retrofit.html"
    });

    function seismicRetrofit (filter, $http, NgTableParams) {
      var ctrl = this;

      ctrl.$onInit = function () {
        ctrl.q = "";
        $http.get("data.json", { cache: true }).then(function (results) {
          ctrl.data = results.data;
        });
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
