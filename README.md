<h2>StackTack</h2>
<p>StackTack is a tool that will fetch information about any question in the Stack Exchange network of sites and format it in a nicely-styled and functional widget.</p>

<h3>Dependencies</h3>
<ul>
  <li>jQuery (I haven't determined the minimum version yet.)</li>
</ul>

<h3>Installation</h3>
<p>Adding StackTack to a page can be done as follows:</p>
<ol>
  <li>
    Create an element in your page like so:
    <pre><code>&lt;div class="stacktack" data-site="stackoverflow" data-id="1732348" &gt;&lt;/div&gt;</code></pre>
  </li>
  <li>
    Add the following to the end of the <code>&lt;body&gt;</code> section of your page:
    <pre><code>&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="path/to/stacktack.min.js"&gt;&lt;/script&gt;</code></pre>
  </li>
  <li>
    After the two lines above, in your <code>$(document).ready()</code> handler, select the elements you want to use with StackTack and call the <code>.stacktack()</code> plugin method on them:
    <pre><code>$('.stacktack').stacktack();</code></pre>
  </li>
</ol>