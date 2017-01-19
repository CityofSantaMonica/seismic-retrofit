(function () {
  "use strict";

  angular
    .module("seismic-retrofit", [])
    .component("seismicRetrofit", {
      controller: ["$http", "filterFilter", seismicRetrofit],
      templateUrl: "seismic-retrofit.html"
    });

    function seismicRetrofit ($http, filter) {
      var ctrl = this;

      ctrl.$onInit = function () {
        ctrl.q = "";
        ctrl.results = [];

        $http.get("data.json", { cache: true }).then(function (results) {
          ctrl.data = results.data;
        });
      };

      ctrl.search = function () {
        var results = [];
        results = results.concat(filter(ctrl.data, { address: ctrl.q }));
        results = results.concat(filter(ctrl.data, { apn: ctrl.q }));
        ctrl.results = results;
      };
    }
})();
