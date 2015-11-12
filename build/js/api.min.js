(function ( ) {
	'use strict';

   angular.module('quotesondev',[])

	 .config(['$locationProvider', function($locationProvider){

	 }])

	 .value('QUOTE_API', {
		 GET_URL: api_vars.root_url + 'wp/v2/posts',
		 POST_URL: api_vars.root_url + 'wp/v2/posts',
		 POST_HEADERS: {
			 'X-WP-Nonce': api_vars.nonce
		 }
	 })

	 .factory('templateSrc', function(){
		 		var template_src_url = '/project6/wp-content/themes/quotesondev/build/js/angular/templates/';
				return function(name){
					return template_src_url + name + '.html'
				}
	 })

	 .factory('quotes',['$http','QUOTE_API', '$q', function($http, QUOTE_API, $q){
		 		return {
					getRandomQuote: function(){

						var d = $q.defer();

						var req = {
							method: 'GET',
							url: QUOTE_API.GET_URL + '?filter[orderby]=rand&filter[posts_per_page]=1'
						}
						return $http(req);
					},
					submit: function(quote) {
							var data = {
							 title: quote.quote_title,
	 						 content:quote.quote_content,
	 						 _quod_quote_source: quote.quote_source,
	 						 _quod_quote_source_url: quote.quote_source_url,
							 post_status: 'pending'

							};

							var req = {
								method: 'POST',
								url: QUOTE_API.POST_URL,
								headers: QUOTE_API.POST_HEADERS,
								data: data
							}

							function quote(response) {
		 					 var quote = response.data[0];
		 					 return {
		 						 title: quote.title.rendered,
		 						 source:quote._qod_quote_source,
		 						 source_url:quote._quod_quote_source_url,
		 						 slug: quote.slug,
		 						 content: angular.element(quote.content.rendered).text()
		 					 }
		 				 }
						 function getRandomQuoteSuccess(response){
							 d.resolve(quote(response));
						 }
						 function getRandomQuoteFailed(error){
							 d.reject(error);
						 }
						 $http(req).then(getRandomQuoteSuccess, getRandomQuoteFailed);
						 return d.promise;
					}
				}
	 }])


	 .controller('quoteFormCtrl', ['$scope', 'quotes', function($scope, quotes){
		 $scope.quote = {};

		 function quoteSuccess(response){
			 console.log('Success!',response);
		 }

		 function quoteFail(error){
			 console.log('Error! Errror!', error);
		 }

		 $scope.submitQuote = function(quoteForm){

			 			if (quoteForm.$valid){
							quotes.submit($scope.quote).then( quoteSubmitSuccess, quoteSubmitFail );


						}
						else {
            alert('Form Invalid')}

        }


	 }])

	 .directive('quoteRotator', ['quotes', 'templateSrc', '$location', function(quotes, templateSrc, $location){
		 return {
			 restrict: 'E',
			 templateUrl: templateSrc('quote-rotator'),
			 link: function (scope, element, attrs){



				 function renderRandomQuote(quote){
					 scope.quote = quote;
				 }
				 scope.newRandomQuote = function (){
					 quotes.getRandomQuote().then(renderRandomQuote)
				 }
				 scope.newRandomQuote();
			 }
		 }
	 }])

	 .directive('source', function(){
		 return {
			 restrict: 'E',
			 scope: {
				 'wisdom': '='
			 },
			 template: '<span class="source">\
			 							<span ng-if="wisdom.source&&wisdom.source_url">,\
											<a href="{{wisdom.source_url}}">{{wisdom.source}} </a>\
										</span>\
										<span ng-if="wisdom.source&&!wisdom.source_url">, {{wisdom.source}}</span>\
										</span>'

		 }
	 })



}());
