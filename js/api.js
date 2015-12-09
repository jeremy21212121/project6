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
				getRandomQuote: function() {

						var d = $q.defer();

						var req = {
								method: 'GET',
								url: QUOTE_API.GET_URL + '?filter[orderby]=rand&filter[posts_per_page]=1'
						}

						function quote(response) {
								var quote = response.data[0];
								return {
										title: quote.title.rendered,
										source: quote._qod_quote_source,
										source_url: quote._qod_quote_source_url,
										slug: quote.slug,
										content: angular.element(quote.content.rendered).text()
								}
						}

						function getRandomQuoteSuccess(response) {
								d.resolve(quote(response));
						}


						function getRandomQuoteFailed(error) {
								d.reject(error);
						}


						$http(req).then(getRandomQuoteSuccess, getRandomQuoteFailed);

						return d.promise;

				},
				submit: function(quote) {

						var data = {
								title: quote.quote_author,
								content: quote.quote_content,
								_qod_quote_source: quote.quote_source,
								_qod_quote_source_url: quote.quote_source_url,
								post_status: 'pending'
						};

						var req = {
								method: 'POST',
								url: QUOTE_API.POST_URL,
								headers: QUOTE_API.POST_HEADERS,
								data: data
						}

						return $http(req);

				}
		}


		}])


	 .controller('quoteFormCtrl', ['$scope', 'quotes', function($scope, quotes){
		 $scope.quote = {};

		 function quoteSubmitSuccess(response){
			 console.log('Success!',response);
			 document.getElementById('quote-submission-form').style.display = 'none';
			 document.querySelector('h1.entry-title').innerHTML = "Success!";
			 document.querySelector('h1.entry-title').style.textAlign = 'center';

			 document.querySelector('div.quote-submission-wrapper').innerHTML = "<p class='submit-another'><a href='javascript:history.go(0);'>Submit Another Quote</a></p>";
		 }

		 function quoteSubmitFail(error){
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
				 'quote': '='
			 },
			 template: '<span class="source">\
			 							<span ng-if="quote.source&&quote.source_url">,\
											<a href="{{quote.source_url}}">{{quote.source}} </a>\
										</span>\
										<span ng-if="quote.source&&!quote.source_url">, {{quote.source}}</span>\
										</span>'

		 }
	 })



}());
