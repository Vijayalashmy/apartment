'use strict';

angular.module('rentfinds.rentals', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/rentals', {
    templateUrl: 'rentals/rentals.html',
    controller: 'RentalsCtrl'
  }).
  	when('/details/:id', {
    templateUrl: 'rentals/details.html',
    controller: 'DetailsCtrl'
  }).
  	when('/add', {
    templateUrl: 'rentals/add.html',
    controller: 'RentalsCtrl'
  }).
  	when('/edit/:id', {
    templateUrl: 'rentals/edit.html',
    controller: 'EditCtrl'
  })
}])

.controller('RentalsCtrl', ['$scope', '$firebaseArray', '$location', function($scope, $firebaseArray, $location) {
	refresh();

	$scope.searchRentals = function(){
		var city = $scope.city;

		// Define Firebase Collection
		var ref = new Firebase("https://rentapp-b31df.firebaseio.com/rentals");

		var query={
			"city": city
		}

		$scope.rentals = $firebaseArray(ref.orderByChild('city').equalTo(city));

		$scope.showLatest = false;
		$scope.showResults = true;

	}

	$scope.addRental = function(){
		if($scope.title){ var title = $scope.title; } else { var title = null; }
		if($scope.email){ var email = $scope.email; } else { var email = null; }
		if($scope.phone){ var phone = $scope.phone; } else { var phone = null; }
		if($scope.street_address){ var street_address = $scope.street_address; } else { var street_address = null; }
		if($scope.city){ var city = $scope.city; } else { var city = null; }
		if($scope.state){ var state = $scope.state; } else { var state = null; }
		if($scope.zipcode){ var zipcode = $scope.zipcode; } else { var zipcode = null; }
		if($scope.bedrooms){ var bedrooms = $scope.bedrooms; } else { var bedrooms = null; }
		if($scope.price){ var price = $scope.price; } else { var price = null; }
		if($scope.description){ var description = $scope.description; } else { var description = null; }
		if($scope.image_url){ var image_url = $scope.image_url; } else { var image_url= 'http://www.techguywebsolutions.com/uploads/no-image.jpg'; }
	
		$scope.rentals.$add({
			title: title,
			email: email,
			phone, phone,
			street_address: street_address,
	        city: city,
	        state: state,
	        zipcode: zipcode,
	        bedrooms: bedrooms,
	        price: price,
	        description: description,
	        image_url: image_url,
	        date: Firebase.ServerValue.TIMESTAMP
		}).then(function(ref){
			var id = ref.key();
			console.log('Added record with '+id);

			// Send Message
			$scope.msg = 'Your rental has been added';

			clearFields();
		});

	}

	// Remove Rental
	$scope.removeRental = function(rental, id){
		// GET DB Instance
		var ref = new Firebase('https://rentapp-b31df.firebaseio.com/rentals/'+ id);

		ref.remove();

		$scope.msg="Rental Removed";
		$location.path('/#rentals');
	}

	function clearFields(){
		console.log('Clearing All Fields...');

		$scope.title = '';
		$scope.email = '';
		$scope.phone = '';
		$scope.bedrooms = '';
		$scope.price = '';
		$scope.description = '';
		$scope.street_address = '';
		$scope.city = '';
		$scope.state = '';
		$scope.zipcode = '';
	}

	$scope.refresh = function(){
		refresh();
	}

	function refresh(){
		// Define Firebase Collection
		var ref = new Firebase('https://rentapp-b31df.firebaseio.com/rentals');

		$scope.rentals = $firebaseArray(ref);

		$scope.showLatest = true;
		$scope.showResults = false;
	}
}])

.controller('DetailsCtrl', ['$scope', '$firebaseObject', '$routeParams', function($scope, $firebaseObject, $routeParams) {
	// Get ID From URL
	$scope.id = $routeParams.id;

	// GET DB Instance
	var ref = new Firebase('https://rentapp-b31df.firebaseio.com/rentals/'+ $scope.id);

	// GET Rental Data
	var rentalData = $firebaseObject(ref);

	// Bind Data to Scope
	rentalData.$bindTo($scope, "data");

}])

.controller('EditCtrl', ['$scope','$routeParams', '$firebaseObject', function($scope, $routeParams, $firebaseObject) {
	// Get ID From URL
	$scope.id = $routeParams.id;

	// GET DB Instance
	var ref = new Firebase('https://rentapp-b31df.firebaseio.com/rentals/'+ $scope.id);

	// GET Rental Data
	var rentalData = $firebaseObject(ref);

	// Bind Data to Scope
	rentalData.$bindTo($scope, "data");

	$scope.editRental = function(rental, id){
		// GET DB Instance
		var ref = new Firebase('https://rentapp-b31df.firebaseio.com/rentals/'+ id);

		$scope.msg = "Rental Updated";
	}
}])