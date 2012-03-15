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
    Add the following to the <code>&lt;head&gt;</code> section of your page:
    <pre><code>&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="path/to/stacktack.min.js"&gt;&lt;/script&gt;</code></pre>
  </li>
  <li>
    Add the following code to your <code>$(document).ready()</code> handler:
    <pre><code>$('.stacktack').stacktack();</code></pre>
  </li>
  <li>
    Create an element in your page like so:
    <pre><code>&lt;div id="stacktack" data-site="stackoverflow" data-id="1732348" &gt;&lt;/div&gt;</code></pre>
  </li>
</ol>