(function() {
	'use strict';

	angular
		.module('bizdir.common')
		.factory('db', ['ENV', function(ENV) {
			return new Firebase(ENV.firebaseUrl)
		}])
		.factory('firebaseDataService', firebaseDataService);

	firebaseDataService.$inject = ['$http', '_', 'db', '$q', '$firebaseArray', '$firebaseObject'];

	/* @ngInject */
	function firebaseDataService($http, _, db, $q, $firebaseArray, $firebaseObject) {
		var service = {
			getBusinesses: getBusinesses,
			getCatalogs: getCatalogs,
			getCommon: getCommon,
			getBusiness: getBusiness,
			getBusinessesByCategory: getBusinessesByCategory,
			getCategories: getCategories,
			getCatalog: getCatalog,
			getProducts: getProducts,
			getProduct: getProduct,
			getServices: getServices,
			getService: getService,
			getArticle: getArticle,
			getArticles: getArticles
		};
		return service;

		// ***********************************************************

		function getArticles(businessId) {
			var query = db.child('news').orderByChild('business').equalTo(businessId);
			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getArticle(businessId, articleId) {
			var query = db.child('news/' + articleId);
			return $firebaseObject(query).$loaded().then(initItem);
		}

		function getServices(businessId) {
			var query = db.child('services').orderByChild('business').equalTo(businessId);
			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getService(businessId, serviceId) {
			var query = db.child('services/' + serviceId);
			return $firebaseObject(query).$loaded().then(initItem);
		}

		function getProducts(businessId) {
			var query = db.child('poducts').orderByChild('business').equalTo(businessId);
			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getProduct(businessId, productId) {
			var query = db.child('poducts/' + productId);
			return $firebaseObject(query).$loaded().then(initItem);
		}

		function getBusinesses() {
			var query = db.child('businesses');
			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getBusinessesByCategory(category) {
			var query = db.child('businesses');

			if (category !== 'All') {
				query = query.orderByChild('category').equalTo(category);
			}

			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getBusiness(businessId) {
			var query = db.child('businesses/' + businessId);
			return $firebaseObject(query).$loaded().then(initItem);
		}

		function getCategories() {
			var query = db.child('businesses');
			return $firebaseArray(query).$loaded().then(function(businesses) {
				var categories = _.map(businesses, function(business) {
					return business.category;
				});
				return ['All'].concat(_.sortBy(_.unique(categories)));
			});
		}

		function getCatalog(businessId, catalogId) {
			var query = db.child('catalogs/' + catalogId);
			return $firebaseObject(query).$loaded().then(initItem);
		}

		function getCatalogs(businessId) {
			var query = db.child('catalogs').orderByChild('business').equalTo(businessId);
			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getCommon() {
			var query = db.child('common');
			return $firebaseObject(query).$loaded().then(initItem);
		}

		function initItem(item) {
			return angular.extend({}, item, {
				guid: item.$id
			});
		}

		function initArray(array) {
			return _.map(array, initItem);
		}
	}
})();
