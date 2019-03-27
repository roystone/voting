# voting
<h2>WordPress Vote Up</h2>

WordPress Vote up PHP voting script, it allow visitors to vote posts.
it is setup by unique ID which saved as identical in database.
for each post it will save their id along with it.

Code inside shortcode below
Class infact pulling up the style also firing the script.
ID here actually getting the vote to save in database.
<code><div class="vot_updown1" id="vt_voting_'.esc_attr(get_the_ID()).'"></div></code>

for better user experience, i have created shortcode to paste it in each post 

<code>"[voting_shortcode][/voting_shortcode]"</code>

You will need PHP5 and a database (e.g. MySQL). 
