var app = angular.module('myApp', []);

app.constant('environment', {
    base_url: 'http://localhost:3000/api',
});

app.controller('NavbarController', ['$scope', 'AuthService', function ($scope, AuthService) {
    // Periksa apakah token ada di localStorage
    $scope.isLoggedIn = !!localStorage.getItem('auth_token');
    $scope.isAdmin = AuthService.isAdmin();
    $scope.userName = localStorage.getItem('name')

    // Handle Login/Logout action
    $scope.handleAuth = function () {
        if ($scope.isLoggedIn) {
            // Logout: Hapus token dan refresh halaman
            localStorage.removeItem('auth_token');
            localStorage.removeItem('name');
            localStorage.removeItem('role');
            $scope.isLoggedIn = false;
            $scope.isAdmin = false;
            $scope.userName = null;
            window.location.href = 'index.html'; // Redirect ke halaman utama
        } else {
            // Login: Redirect ke halaman login
            window.location.href = 'login.html';
        }
    };
}]);

app.factory('AuthService', ['$http', 'environment', '$q', function ($http, environment, $q) {
    var baseUrl = environment.base_url + '/auth';

    return {
        getRole: function () {
            return localStorage.getItem('role');
        },
        isAdmin: function () {
            return this.getRole() === 'admin';
        },
        login: function (credentials) {
            var deferred = $q.defer();

            $http.post(baseUrl + '/login', credentials)
                .then(function (response) {
                    var token = response.data.data.token;
                    localStorage.setItem('auth_token', token);

                    // Decode token untuk mendapatkan name dan role
                    var payload = JSON.parse(atob(token.split('.')[1])); // Decode payload dari JWT
                    localStorage.setItem('name', payload.name); // Simpan nama pengguna
                    localStorage.setItem('role', payload.role); // Simpan role pengguna

                    deferred.resolve(response);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        },
        register: function (credentials) {
            var deferred = $q.defer();

            $http.post(baseUrl + '/register', credentials)
                .then(function (response) {
                    deferred.resolve(response);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        },
    };
}]);

app.factory('ProductService', ['$http', 'environment', '$q', function ($http, environment, $q) {
    var baseUrl = environment.base_url + '/products';

    return {
        getAllProducts: function () {
            return $http.get(baseUrl);
        },
        filterProducts: function (filters) {
            return $http.get(baseUrl + '/filter', { params: filters });
        },
        getProductById: function (id) {
            var deferred = $q.defer();
    
            $http.get(baseUrl + '/' + id)
                .then(function (response) {
                    deferred.resolve(response);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
    
            return deferred.promise;
        },
        create: function (product) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.post(`${baseUrl}`, product, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        update: function (id, product) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.put(`${baseUrl}/${id}`, product, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        delete: function (id) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.delete(`${baseUrl}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    };
}]);

app.factory('CategoryService', ['$http', 'environment', '$q', function ($http, environment, $q) {
    var baseUrl = environment.base_url + '/categories';

    return {
        getCategories: function () {
            return $http.get(baseUrl);
        },
        getCategoryById: function (id) {
            const token = localStorage.getItem('auth_token');
            var deferred = $q.defer();
    
            $http.get(baseUrl + '/' + id, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(function (response) {
                    deferred.resolve(response);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
    
            return deferred.promise;
        },
        createCategory: function (category) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.post(baseUrl, category, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        updateCategory: function (id, category) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.put(`${baseUrl}/${id}`, category, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        deleteCategory: function (id) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.delete(`${baseUrl}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    };
}]);

app.factory('CartService', ['$http', '$q', 'environment', function ($http, $q, environment) {
    var baseUrl = environment.base_url + '/carts';

    return {
        // Tambah produk ke keranjang
        addToCart: function (cartItem) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.post(baseUrl, cartItem, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },

        // Ambil keranjang pengguna saat ini
        getMyCart: function () {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.get(`${baseUrl}/my-cart`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },

        // Perbarui item di keranjang
        updateCartItem: function (cartId, updatedItem) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.put(`${baseUrl}/${cartId}`, updatedItem, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },

        // Hapus item dari keranjang
        deleteCartItem: function (cartId) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.delete(`${baseUrl}/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },

        // Hapus semua item dari keranjang pengguna saat ini
        clearMyCart: function () {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.delete(`${baseUrl}/my/clear`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        // Melakukan checkout dengan daftar barang
        checkout: function (items) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.post(environment.base_url + `/orders/checkout`, { items }, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
    };
}]);

app.factory('OrderService', ['$http', '$q', 'environment', function ($http, $q, environment) {
    var baseUrl = environment.base_url + '/orders';
    const token = localStorage.getItem('auth_token');

    return {
        // Mendapatkan daftar pesanan pengguna
        getMyOrders: function () {
            const deferred = $q.defer();

            $http.get(`${baseUrl}/my-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },

        // Mendapatkan semua pesanan
        getAllOrders: function () {
            const deferred = $q.defer();

            $http.get(`${baseUrl}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },

        // Mendapatkan detail pesanan berdasarkan ID
        getOrderDetails: function (orderId) {
            const deferred = $q.defer();

            $http.get(`${baseUrl}/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },

        // Melakukan checkout dengan daftar barang
        checkout: function (items) {
            const token = localStorage.getItem('auth_token');
            const deferred = $q.defer();

            $http.post(`${baseUrl}/checkout`, { items }, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },

        // Memperbarui status pesanan
        updateOrderStatus: function (orderId, status) {
            const deferred = $q.defer();

            $http.put(`${baseUrl}/${orderId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(function (response) {
                deferred.resolve(response.data);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    };
}]);