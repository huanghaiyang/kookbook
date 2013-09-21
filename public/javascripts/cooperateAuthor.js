$(document).ready(function() {
  function showEdit() {
    $("#editMainDiv").removeClass('editMain1');
    $('#editColsDiv').css({
      'display': 'block'
    });
    $('#editMainDiv').animate({
      height: '500px'
    }, {
      queue: false,
      duration: 600,
      easing: 'easeOutBounce'
    });
  }
  if ($('#addAuthorBtn').length > 0) {
    $('#addAuthorBtn').bind('click', function(event) {
      var $t = $(this);
      $t.remove();
      showEdit();
    });
  } else {
    showEdit();
  }

  function setPencilDels(delNameIco_) {
    var $delNameIco_ = delNameIco_;
    $delNameIco_.bind('click', function(event) {
      var $t = $(this);
      var order = $t.attr('data-del');
      $('input[id="pencilnames' + order + '"]') ? $($('input[id="pencilnames' + order + '"]')).remove() : null;
      $t.remove();
      $('.add_pname_tip').length > 0 ? $('.add_pname_tip').remove() : null;
      $('#addPNameIco').attr('data-status', 'none');
    });
  }
  $('p[name="pencilnamesDel"]').each(function(index, del) {
    var $delNameIco_ = $(this);
    setPencilDels($delNameIco_);
  });
  $('#addPNameIco').bind('click', function(event) {
    cooperateChanged();
    var $t = $(this);
    if ($('input[name="pencilnames"]').size() >= 4) {
      if ($t.attr('data-status') == 'none') {
        $('<p class="help-inline add_pname_tip"><font color="#D52100">!</font>已不能再添加笔名填写项</p>').insertBefore('#addPNameIco');
        $t.attr('data-status', 'done');
      }
    } else {
      $('<input type="text" class="input-small" id="pencilnames' + $('input[name="pencilnames"]').size() + '"name="pencilnames" placeholder="笔名" style="margin-left:5px;">').insertBefore('#addPNameIco');
      var $delNameIco_ = $('<p class="help-inline add_name_ico1" title="删除前方的填写项" data-del="' + ($('input[name="pencilnames"]').size() - 1) + '">-</p>');
      $delNameIco_.insertBefore('#addPNameIco');
      setPencilDels($delNameIco_);
    }
  });

  function cooperateChanged() {
    if (window.sessionStorage) {
      sessionStorage.setItem('cooperate-author-changed', 'true');
    }
  }
  $('#countryAhref').fancybox({
    'opacity': true,
    'overlayShow': false,
    'autoScale': false,
    'transitionIn': 'fade',
    'transitionOut': 'fade',
    'centerOnScroll': true,
    'showCloseButton': false,
    'titlePosition': 'inside',
    'padding': '0px',
    'changeSpeed': 100
  });
  $('#country').bind('click', function(event) {
    $('#countryAhref').click();
  });
  $('#countrySelectorCloseBtn').click(function() {
    $.fancybox.close();
  });
  $('.countryName').each(function(index, cn) {
    $(cn).bind('click', function(event) {
      var $n = $(this);
      $('#country').val($n.text().replace(/^\s+|\s+$/g, ''));
      $.fancybox.close();
      if ($('#country').attr('data-add-addAfter') == 'false') {
        var $province = $('<input type="text" class="input-small addMargin" id="province" name="province" data-add-addAfter="false">');
        $province.insertAfter('#country');
        $('<span style="margin-left:4px;">州&省:</span>').insertAfter('#country');
        $('#country').attr('data-add-addAfter', 'true');
        $province.bind('click', function(event) {

        });
      }
    });
  });

  $('#addWorthIco').bind('click', function(event) {
    var $t = $(this);
    if ($('input[name="worth"]').size() >= 4) {
      if ($t.attr('data-status') == 'none') {
        $('<p class="help-inline add_worth_tip"><font color="#D52100">!</font>已不能再添加成就填写项</p>').insertBefore('#addWorthIco');
        $t.attr('data-status', 'done');
      }
    } else {
      $('<input type="text" class="input-small" id="worth' + $('input[name="worth"]').size() + '"name="worth" placeholder="奖项" style="margin-left:5px;">').insertBefore('#addWorthIco');
      var delNameIco_ = $('<p class="help-inline add_name_ico1" title="删除前方的填写项" data-del="' + ($('input[name="worth"]').size() - 1) + '">-</p>');
      delNameIco_.insertBefore('#addWorthIco');
      delNameIco_.bind('click', function(event) {
        var $t = $(this);
        var order = $t.attr('data-del');
        $('input[id="worth' + order + '"]') ? $($('input[id="worth' + order + '"]')).remove() : null;
        $t.remove();
        $('.add_worth_tip').length > 0 ? $('.add_worth_tip').remove() : null;
        $('#addWorthIco').attr('data-status', 'none');
      });
    }
  });
});