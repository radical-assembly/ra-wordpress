<?php
/*
 Template Name: eventpage
 *
*/
?>

<?php get_header(); ?>





				<div id="inner-content" class="container cf">
     <div id="map-wrap">
    <!-- This is the container for the leaflet js map -->
    <div id="map"></div>
         <h1 class="page-title"><?php the_title(); ?></h1>
</div> <!-- //map-wrap -->
				<div class="row">
						<main id="main" class="m-all twelve columns" role="main" itemscope itemprop="mainContentOfPage" itemtype="http://schema.org/Blog">

							<?php if (have_posts()) : while (have_posts()) : the_post(); ?>





                            <article id="post-<?php the_ID(); ?>" <?php post_class( 'cf' ); ?> role="article" itemscope itemtype="http://schema.org/BlogPosting">


                                  <div id="content">
<div id="calendar-wrap">
            <header>
				<div id="filter-wrap">
                	<h2>Filter</h2>
					<form id="filter-form">
					    <strong>Tags</strong> |
					    <input type="checkbox" name="tags" value="March"> March |
					    <input type="checkbox" name="tags" value="Demonstration"> Demo |
					    <input type="checkbox" name="tags" value="Discussion"> Discussion |
					    <input type="checkbox" name="tags" value="Debate"> Debate |
					    <br>
					    <strong>Groups</strong> |
					    <input type="checkbox" name="groups" value="TestGroup1"> TestGroup1 |
					    <input type="checkbox" name="groups" value="TestGroup2"> TestGroup2 <br>
					    <input type="submit" value="Apply Filter">
						<input type="submit" value="Get iCal feed">
					</form>
				</div>
            </header>
            <div id="calendar">
            </div><!-- /. calendar -->
        </div><!-- /. wrap -->






								<footer class="article-footer">


								</footer>



							</article>

							<?php endwhile; else : ?>

									<article id="post-not-found" class="hentry cf">
											<header class="article-header">
												<h1><?php _e( 'Oops, Post Not Found!', 'bonestheme' ); ?></h1>
										</header>
											<section class="entry-content">
												<p><?php _e( 'Uh Oh. Something is missing. Try double checking things.', 'bonestheme' ); ?></p>
										</section>
										<footer class="article-footer">
												<p><?php _e( 'This is the error message in the page-custom.php template.', 'bonestheme' ); ?></p>
										</footer>
									</article>

							<?php endif; ?>

						</main>

						<?php /* get_sidebar(); */?>
</div> <!-- .row -->
				</div>

			</div>


<?php get_footer(); ?>
