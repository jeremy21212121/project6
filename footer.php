<?php
/**
 * The template for displaying the footer.
 *
 * @package RED_Starter_Theme
 */

?>

			</div><!-- #content -->

			<footer id="colophon" class="site-footer" role="contentinfo">
				<div class="site-info">
					<ul class="footer-navigation clearfix">
						<?php wp_list_pages('title_li='); ?>
						<li>a RED Academy project by <a href="http://www.jeremypoole.ca/">Jeremy Poole</a></li>
					</ul>
				</div><!-- .site-info -->
			</footer><!-- #colophon -->
		</div><!-- #page -->

		<?php wp_footer(); ?>

	</body>
</html>
