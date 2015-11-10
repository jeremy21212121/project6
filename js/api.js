(function ($) {
	'use strict';

   /**
    * Ajax-based random post fetching.
    */

	$(function() {

		$('#new-quote-button').on('click', function(event){
			event.preventDefault();
			$.ajax({
				method: 'get',
				url: api_vars.root_url + 'wp/v2/posts?filter[orderby]=rand&filter[posts_per_page]=1',
				cache: false


			}).done(function(data){
				var post=data.shift(),
						quoteSource=post._qod_quote_source,
						quoteSourceUrl = post._qod_quote_source_url,
						$sourceSpan = $('.source');
				$('.entry-content').html( post.content.rendered );
				$('.entry-title').html( '<h2 class="entry-title">&mdash;' + post.title.rendered + '</h2>');

				if (quoteSource && quoteSourceUrl) {
					$sourceSpan.html( ', <a href="' + quoteSourceUrl + '">' + quoteSource + '</a>' );
				} else if (quoteSource) {
					$sourceSpan.html(', ' + quoteSource);
				} else {
					$sourceSpan.text('');
				}


			});
		});

	});

   /**
    * Ajax-based front-end post submissions.
    */

		$('#quote-submission-form').on('submit', function(event){
 		 event.preventDefault();
 		 var title = $('#quote-author').val(),
		 		 content = $('#quote-content').val(),
				 quoteSource = $('#quote-source').val(),
				 quoteSourceUrl = $('#quote-source-url').val();
		 var data = {
			 		title: title,
					content: content,
					quoteSource: quoteSource,
					quoteSourceUrl: quoteSourceUrl
		 };

			 $.ajax({
	 			method: 'post',
	 			url: api_vars.root_url + 'wp/v2/posts',
				data: data,
        beforeSend: function ( xhr ) {
              xhr.setRequestHeader( 'X-WP-Nonce', api_vars.nonce );
						}

			}).done(function(response){
				$('.quote-submission').toggle('slow');
				console.log( response );
				$('.quote-submission').append('<h1 class="white">Success!</h1>');
                alert( api_vars.success );
			}).fail(function(response) {
				console.log( response );
						alert( api_vars.failure )
					 $('.quote-submission').append('<h1 class="white">Fail!</h1>');
        });

 		 });

}(jQuery));