<h2>StackTack</h2>
<p>StackTack is a tool that will fetch information about any question in the Stack Exchange network of sites and format it in a nicely-styled and functional widget.</p>

<h3>Dependencies</h3>
<ul>
  <li>jQuery</li>>
</ul>

<h3>Installation</h3>
<p>Adding StackTack to a page can be done as follows:</p>
<ol>
  <li>
    Add the following to the <code>&lt;head&gt;</code> section of your page:
    <pre><code>&lt;link rel="stylesheet" href="styles/base.css" /&gt;</code></pre>
  </li>
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

<h3>What Has Been Changed</h3>
<p>This fork contains a number of changes from the <a href="https://bitbucket.org/zamtools/stacktack">original code</a>. The details of these changes are below:</p>
<ul>
  <li>The removal of icons / images</li>
  <li>The addition of a build system (not complete yet)</li>
  <li><code>.stacktack()</code> now operates on the current set of matched elements instead of searching for elements based on ID</li>
  <li>Options can be specified globally yet overridden on a per-invocation and per-element basis (including <code>site</code>)</li>
</ul>