<?php
/*
 Template Name: homepage
 *
*/
?>

<?php get_header(); ?>

<section id="masthead-form" class="content cf">
            <h1>Democracy, <strong>Now</strong></h1>
            <div class="intro">
            <h2>We are the Radical Assembly.</h2>
            <h4> We’re working to link and strengthen community-led campaigns for liberation and social justice.</h4>
            <h3>Join us.</h3>
            </div>
            <div class="container">
            	<div class="row">
            	<div class="four columns offset-by-two">
            		
                    <h3>Join our mailing list:</h3>
                    <form method="post" onsubmit="return submitForm();" id="signup" class="form">
                    <div class="form-wrap">
                        <div class="row">
                            <input class="input_label floatlabel" name="email" type="text">
                            <label class="contact_label" for="email">Email*</label>
                        </div>
                        <div class="row">
                            <input class="input_label floatlabel" type="text" name="name">
                            <label class="contact_label" for="name">Name</label>
                        </div>
                        <input type="submit" value="Submit">
                        </div>
                        <div class="form-result"></div>
                    </form>
              
            	</div>
            	<div class="four columns">
            		
                    <h3>Join our next assembly:</h3>

                    <p>13:00 - 18:00<br />
                    Sunday 11<sup>th</sup> October,<br />
                    The Brady Art Centre,<br />
                    Hanbury St,<br />
                    E1 5HU<br /></p>
                    <p><a href="https://goo.gl/maps/drfPz">Map</a> <a href="https://www.facebook.com/events/1452991618343164/">Facebook Event</a> </p>

					</p>
                
                
                </div>
               
      
            	</div>
            		
    	</div>
          
               
                
            
        </section>
			<div id="content">

				<div id="inner-content" class="container cf">

				<div class="row">
						<main id="main" class="m-all twelve columns" role="main" itemscope itemprop="mainContentOfPage" itemtype="http://schema.org/Blog">

							<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

							<article id="post-<?php the_ID(); ?>" <?php post_class( 'cf' ); ?> role="article" itemscope itemtype="http://schema.org/BlogPosting">

								<header class="article-header">

									<h1 class="page-title"><?php the_title(); ?></h1>

									<p class="byline vcard">
										<?php printf( __( 'Posted <time class="updated" datetime="%1$s" itemprop="datePublished">%2$s</time> by <span class="author">%3$s</span>', 'bonestheme' ), get_the_time('Y-m-j'), get_the_time(get_option('date_format')), get_the_author_link( get_the_author_meta( 'ID' ) )); ?>
									</p>


								</header>

								<section class="entry-content cf" itemprop="articleBody">
									<?php
										// the content (pretty self explanatory huh)
										the_content();

										?>
								</section>


								<footer class="article-footer">

                  <?php the_tags( '<p class="tags"><span class="tags-title">' . __( 'Tags:', 'bonestheme' ) . '</span> ', ', ', '</p>' ); ?>

								</footer>

								<?php comments_template(); ?>

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
