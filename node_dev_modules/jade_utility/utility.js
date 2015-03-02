function replaceFirstTag(tag, textIn, substituteText) {
  tag = '<<' + tag + '>>';
  var loc = textIn.indexOf(tag);
  var head = textIn.slice(0, loc);
  var foot = textIn.slice(loc + tag.length);

  return head + substituteText + foot;
}

exports.replaceFirstTag = replaceFirstTag;
