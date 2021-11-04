/// <reference path="angular.min.js" />


var myapp = angular.module('MyApp', [/*'angularUtils.directives.dirPagination'*/]);

myapp.controller("ProductController", function ($scope, $http) {

    

    $http({
        method: "get",
        url: "/Home/GetDetail"
    }).then(function (d) {
        $scope.detail = d.data;
    }, function (error) {
        //alert('Failed');
    });

    $http({
        method: "get",
        url: '/Home/GetProducts'
    }).then(function success(d) {
        $scope.products = d.data;
        
    }, function (error) {
        //alert("failure");
    });

    $http({
        method: "get",
        url: '/Home/GetCategories'
    }).then(function success(d) {
        $scope.categories = d.data;
    }, function (error) {
        alert('failed');
    });

    $scope.selectCategory = function (cat_id) {
        localStorage.setItem('cat_id', cat_id);
    }

    $scope.sortcolumn = "Product_id";
    $scope.reverse = true;
    $scope.direct = "Ascending";

    $scope.Chon = function (d) {

        if ($scope.direct == "Ascending") {
            $scope.reverse = false;
            $scope.direct = "Decreasing";
        } else {
            $scope.reverse = true;
            $scope.direct = "Ascending";
        }
    }


    $scope.maxSize = 3;
    $scope.totalCount = 0;
    $scope.pageIndex = 1;
    $scope.pageSize = 5;
    $scope.searchName = "";

    $scope.GetSanPhams = function (index) {
        var productName = localStorage.getItem("Product_title");
        $http({
            method: 'get',
            url: 'Home/GetProductsP',
            params: {
                pageIndex: index,
                pageSize: $scope.pageSize,
                productName: $scope.productName
            }
        }).then(function success(d) {
            $scope.ListProductsP = d.data.Products;
            $scope.totalCount = $scope.ListProductsP.totalCount;
            console.log(d.data.Products);
        }, function (error) {
            alert('lay san pham phan trang loi');
        });
    }
    

    $scope.setItem = function (id) {
        //Lay ve san pham theo id
        var username = sessionStorage.getItem("username");
        var data_product = [];
        if (username != null) {
            $http({
                method: "get",
                url: '/Home/GetDetail/' + id
            }).then(function success(d) {
                $scope.details = d.data;
                var current_product = window.sessionStorage.getItem('orders');
                if (current_product == null) {
                    data_product.push($scope.details);
                    window.sessionStorage.setItem("orders", JSON.stringify(data_product));
                }
                else if (current_product != null) {
                    data_product = JSON.parse(current_product);
                    data_product.push($scope.details);
                    window.sessionStorage.setItem("orders", JSON.stringify(data_product));
                }
            }, function (error) {
                alert("failure");
            });
        }
        else if (username == null) {
            alert("Bạn cần đăng nhập để đặt mua!");
        }

    };

    $scope.getItem = function () {
        var orders = window.sessionStorage.getItem("orders");
        var data = JSON.parse(orders);
        $scope.orders = data;
        console.log($scope.orders);
        //Chưa lấy được hình ảnh, tên từ session
    }

    

    $scope.Login = function () {
        const pathname_login = window.location.pathname;
        window.sessionStorage.setItem('pathname_login', pathname_login);
    };
});


myapp.controller('CatgoryController', function ($scope, $http) {
    var cat_id = localStorage.getItem('cat_id');
    $http({
        method: "get",
        url: '/Home/GetProductCategory',
        params: { CatID: cat_id }
    }).then(function success(d) {
        $scope.product_category = d.data;
    }, function (error) {
        //alert('Lấy sản phẩm theo loại lỗi');
    });
});

