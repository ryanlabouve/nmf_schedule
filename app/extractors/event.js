import Ember from "ember";

var $ = Ember.$;

var guid = 0;

export function resetGuid() {
  guid = 0;
}

function toArray(arr) {
  return [].map.call(arr, item => item);
}

function toInt(val, base = 10) {
  return parseInt(val, base) || 0;
}

function extractID(possibleID) {
  var segments = possibleID.split('/');
  return segments[segments.length-2];
  //return(possibleID);
  //var match = /^(?:up_|item\?id=)(\d+)$/.exec(possibleID);
  //return (match && match[1]) || null;
}

function generateID(prefix = "dead") {
  return `${prefix}-${ guid++ }`;
}

function extractTag(title) {
  if (title.indexOf("Show HN: ") === 0) {
    return "Show HN";
  } else if (title.indexOf("Ask HN: ") === 0) {
    return "Ask HN";
  } else {
    return null;
  }
}

function extractTitle(title) {
  var tag = extractTag(title);
  title = tag ? title.slice(tag.length + 2) : title;
  return title.replace(/\s+/g, " ").trim();
}

function extractSource(source) {
  var match = /^\((.+)\)$/.exec(source);
  return (match && match[1]) || null;
}

function extractSubmitted(text) {
  var match = /(\d+ \w+ ago)/.exec(text);
  return (match && match[1]) || null;
}

function extractQuality(color) {
  var match = /#([0-9a-f]{2})[0-9a-f]{4}/i.exec(color);
  if (match && match[1]) {
    return ( 255 - toInt(match[1], 16) ) / 255;
  } else {
    return null;
  }
}

function extractBody(lines) {
  return toArray(lines).map( line => (line.innerText || line.textContent).replace(/\s/g, " ").trim() ).join("\n\n") || null;
}

function extractComment(event, row) {
  // A normal comment row looks like this:
  //
  //   <tr>
  //     <td><img src="s.gif" height="1" width="40"></td>
  //     <td>...vote arrows...</td>
  //     <td>
  //       <div>
  //         <span class="comhead">
  //           <a href="...">cbd1984</a> <a href="item?id=9052474">12 hours ago</a> <span class="deadmark"></span>
  //         </span>
  //       </div>
  //       <br>
  //       <span class="comment">
  //         <font color="#000000">
  //           ...
  //           <p><font color="#000000">...</font></p>
  //           <p><font color="#000000">...</font></p>
  //           <p><font size="1"><u><a href="...">reply</a></u></font></p>
  //         </font>
  //       </span>
  //     </td>
  //   </tr>
  //
  // From here, we want to extract:
  //
  //   1. The ID of the comment
  //   2. The nesting level
  //   3. The submitter username
  //   4. The submission time
  //   5. The "quality" of the comment
  //   6. The body of the comment
  //
  // Most of these should be self-explainatory. The "nesting level" is the width
  // of the spacer gif (see `extractComments` for how its used). The quality is
  // represented visually via the font color with different shades of gray. We
  // normalize it to a float between 0 and 1 where 0 (#ffffff) is the worst and
  // 1 (#000000) is normal.
  //
  // But a comment could also be dead (deleted), in which case it looks like
  // this:
  //
  //   <tr>
  //     <td><img src="s.gif" height="1" width="80"></td>
  //     <td><span class="deadmark"></span></td>
  //     <td>
  //       <div>
  //         <span class="comhead">...</span>
  //       </div>
  //       <span class="comment">[deleted]</span>
  //     </td>
  //   </tr>
  //

  var comment = {
    id:        null,
    isDead:    false,
    body:      null,
    quality:   null,
    submitter: null,
    submitted: null,
    level:     null,
    parent:    null,
    comments:  [],
    event:     event.id
  };

  var $spacer    = $("img[src='s.gif'][width]", row),
      $comhead   = $(".comhead", row),
      $body      = $(".comment font", row),
      $submitter = $comhead.find("a:first-of-type"),
      $submitted = $comhead.find("a:last-of-type");

  if ($submitted.length) {
    comment.id = extractID( $submitted.attr("href") );

    if ($body.last().find("a[href^=reply]").length) {
      comment.body = extractBody( $body.not(":last") );
    } else {
      comment.body = extractBody( $body );
    }

    comment.quality = extractQuality( $body.first().attr("color") ) || 1;
    comment.submitter = $submitter.text().trim();
    comment.submitted = extractSubmitted( $submitted.text().trim() );
  } else {
    comment.id = generateID();
    comment.isDead = true;
  }

  comment.level = toInt( $spacer.attr("width") );

  return comment;
}

//function extractComments(event, rows) {
  //var comments = [];

  //event.comments = [];

  //// Keep track of the nesting of the comments. This is orangized as a stack of
  //// { level, parent, lastSibling } tuples.
  ////
  //// The nesting level is an "arbitary" integer scale where larger numbers means
  //// deeper nesting. (In reality, this number corresponding to the width of
  //// indentation/padding in the markup.)
  ////
  //// The parent is parent for all comments at this level, i.e. the most recently
  //// seen comment from the previous level.
  ////
  //// The lastSibling is the most recently seen comment at this level.

  //var nesting = [ [0, null, null] ];

  //toArray(rows).forEach( (row) => {
    //let comment = extractComment(event, row);

    //let level, parentComment, lastSibling;

    //[level, parentComment, lastSibling] = nesting[0];

    //while (comment.level < level) {
      //nesting.shift();
      //[level, parentComment, lastSibling] = nesting[0];
    //}

    //if (comment.level === level) {
      //comment.parent = parentComment && parentComment.id;
      //nesting[0][2]  = comment;
    //} else {
      //parentComment  = lastSibling;
      //comment.parent = parentComment.id;
      //nesting.unshift( [comment.level, parentComment, comment] );
    //}

    //comments.push( comment );

    //if (parentComment) {
      //parentComment.comments.push( comment.id );
    //} else {
      //event.comments.push( comment.id );
    //}

    //delete comment.level;
  //});

  //return comments;
//}

function buildSortableTime(day, time){
  var sortableTime = 0;
  switch(day){
    case "thursday":
      sortableTime = 100000;
      break;

    case "friday":
      sortableTime = 200000;
      break;

    case "saturday":
      sortableTime = 300000;
      break;
  }
  var timePart = time.split(" ")[0],
      amPmPart = time.split(" ")[1],
      hourPart = parseInt(timePart.split(":")[0]),
      minPart  = parseInt(timePart.split(":")[1]);

  if(hourPart === 12){
    // leave it alone
  }else{ // afternoon
    hourPart += 12;
  }
  if(amPmPart === 'am'){
    hourPart += 12;
  }
  sortableTime += hourPart * 100;
  sortableTime += minPart;
  return sortableTime;
}

function extractEvent(row1/*, row2, row3, commentRows*/) {
  var event = {
    id:        null,
    day:       null,
    stage:     null,
    time:      null,
    band:      null,
    link:      null,
    sortableTime: null
  };

  var comments = [];

  event.id = extractID( $(".band-title a", row1).attr("href") );

  // An event on NMF Schedule usually look like this:
  //
  //      <li class="saturday bluebonnet-bar after-midnight ">
	//				<div class="schedule-item-info">
	//					<div class="show-time ">
  //					  12:00 am
	//					</div>
	//					<div class="band-title">
	//						<a href="http://normanmusicfestival.com/bands/tyler-hopkins-the-rebellion/">Tyler Hopkins &#038; The Rebellion</a>
	//					</div>
	//					<div class="show-stage">
	//						Bluebonnet Bar
  //					</div>
	//				</div>
	//			</li>
  //
  // We want to extract:
  //
  //   1. The Band:   "Tyler Hopkins &#038; The Rebellion"
  //   2. The link:   "http://normanmusicfestival.com/bands/tyler-hopkins-the-rebellion/"
  //   3. The day:    "saturday"
  //   4. The stage:  "Bluebonnet Bar"
  //   5. The time:   "12:00 am"
  //   6. The sortableTime: ??


  var $bandTag = $(".band-title a", row1),
      bandName = $bandTag.text().trim(),
      link =     $bandTag.attr("href"),
      className  = $(row1).attr('class'),
      day =      className.split(" ")[0],
      time =     $(".show-time", row1).text().trim(),
      stageName =    $(".show-stage", row1).text().trim(),
      sortableTime = buildSortableTime(day, time);



  event.bandName = bandName;
  event.link = link;
  event.day = day;
  event.time = time;
  event.stageName = stageName;
  event.sortableTime = sortableTime;

  //if (event.url.indexOf("item?id=") === 0) {
    //event.tag = event.tag || "Discuss";
    //event.url = `https://news.ycombinator.com/${event.url}`;
  //}

  var source = $(".title .sitebit", row1).text().trim();

  if (source) {
    event.source = extractSource(source);
  }

  // The second row looks something like this:
  //
  //  <td class="subtext">
  //    <span class="score" id="...">155 points</span>
  //    by <a href="...">joewalnes</a>
  //    <a href="...">3 hours ago</a> |
  //    <a href="...">30 comments</a>
  //  </td>
  //
  // We want to extract:
  //
  //   1. The number of points
  //   2. The number of comments
  //   3. The submitter username
  //   4. The submission time
  //
  // Everything besides jobs has all of these properties, so if we couldn't find
  // any of these, set the tag to "Job" and move on. For jobs, the "3 hours ago"
  // is not linked, so we have to be careful with the selectors.

  //var $points    = $(".subtext .score", row2),
      //$comments  = $(".subtext a:last-of-type", row2),
      //$submitter = $(".subtext a:first-of-type", row2),
      //submitted = $(".subtext", row2).text().trim();

  //if ($points.length > 0 && $comments.length > 0 && $submitter.length > 0) {
    //event.points    = toInt( $points.text() );
    //event.submitter = $submitter.text().trim();
    //event.submitted = extractSubmitted( submitted );
    //event.commentsCount = toInt( $comments.text() );
  //} else {
    //event.tag = "Job";
    //event.submitted = extractSubmitted( submitted );
  //}

  // Discussion threads like Ask HN has a body of text attached to them. We can
  // only get that if we are on the item page (as opposed to the index pages).
  //
  // The markup is a little strange, something like this:
  //
  //   <td>
  //     Hello!
  //     <p>Another line.</p>
  //     <p>Moar lines.</p>
  //   </td>
  //

  //if (row3) {
    //event.body = extractBody( $(row3).find("td:has(p)").contents() );
  //}

  // Obviously we will only have this if we are on the item page.

  //if (event.commentsCount !== null && commentRows) {
    //comments = extractComments(event, commentRows);
  //}

  return [event, comments];
}

export function extractSingle(doc) {
  var rows = $("#hnmain table:eq(1) tr", doc);
  var commentRows = $("#hnmain table:eq(2) table", doc);

  var [event, comments] = extractEvent( rows[0], rows[1], rows[3], commentRows );

  return { event, comments };
}

export function extractArray(doc) {
  var meta = {},
      events = [],
      payload = { meta, events };

  //try {
    //meta.next = $("#hnmain tr:last-child a:contains(More)", doc).attr("href").split(/=|&/)[1];
  //} catch(e) {
    //meta.next = null;
  //}

  var rows = toArray( $("ul.schedule-list li", doc) );

  rows.forEach( row => {
    events.push( extractEvent(row)[0] );
  });

  return payload;
}

export function isError(doc) {
  return $("ul.schedule-list li", doc).length === 0;
}

export function parentID(doc) {
  return extractID( $("#hnmain table:eq(1) tr .comhead a:contains(parent)", doc).attr("href") );
}
