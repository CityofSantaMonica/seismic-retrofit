(function () {
  "use strict";

  angular
    .module("seismic-retrofit", ["ngTable"])
    .component("seismicRetrofit", {
      controller: ["$http", "NgTableParams", seismicRetrofit],
      templateUrl: "seismic-retrofit.html"
    });

    function seismicRetrofit ($http, NgTableParams) {
      var ctrl = this;

      ctrl.$onInit = function () {
        $http.get("data.json", { cache: true }).then(function (results) {
          ctrl.data = results.data;
          ctrl.tableParams = new NgTableParams(
            { sorting: { type: "asc" }, count: ctrl.data.length },
            { dataset: ctrl.data, counts: [] }
          );
        });
      };
    }
})();
