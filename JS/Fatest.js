// namespace
window.semantic = {
    handler: {}
};
semantic.Ready = function () {
    //var
    var
        handler,
        $h1 = $('h1'),
        $h2 = $('h2'),
        $h3 = $('h3'),
        $container = $('.ui.main.container'),
        $followMenu = $container.find('.following.menu'),
        //create menu
        handler = {
            showFullImage: function () {
                $('.fullImage').find('img').attr('src', $(this).find('img').attr("src"));
                $('.fullImage').css('display','block');
                $('.fullImage img').css('max-width', '100%').css('max-height', '100%');
            },
            hideFullImage: function () {
                $('.fullImage').css('display','none');
                $('.fullImage img').css('max-width', '0%').css('max-height', '0%');
            },
            getPageTitle: function () {
                return $.trim($('h1').eq(0).contents().filter(function () {
                    return this.nodeType == 3;
                }).text());
            },
            getSafeName: function (text) {
                return text.replace(/\s+/g, '').replace(/[^-,'A-Za-z0-9]+/g, '');
            },
            getText: function ($element) {
                $element = ($element.find('a').not('.label, .anchor').length > 0) ?
                    $element.find('a') :
                    $element;
                var
                    $text = $element.contents().filter(function () {
                        return this.nodeType == 3;
                    });
                return ($text.length > 0) ?
                    $text[0].nodeValue.trim() :
                    $element.find('a').text().trim();
            },
            activate: {
                accordion: function () {
                    var
                        $section = $(this),
                        index = $h2.index($section),
                        $followSection = $followMenu.children('.item'),
                        $activeSection = $followSection.eq(index);
                },
                h2previous: function () {
                    var
                        $menuItems = $followMenu.children('.item'),
                        $section = $menuItems.filter('.active'),
                        index = $menuItems.index($section);
                    if ($section.prev().length > 0) {
                        $section
                            .removeClass('active')
                            .prev('.item')
                            .addClass('active');
                        $followMenu
                            .accordion('open', index - 1);
                    }
                },
                h2next: function () {
                    var
                        $section = $(this),
                        index = $h2.index($section),
                        $followSection = $followMenu.children('.item'),
                        $activeSection = $followSection.eq(index),
                        isActive = $activeSection.hasClass('active');
                    if (!isActive) {
                        $followSection.filter('.active')
                            .removeClass('active');
                        $activeSection
                            .addClass('active');
                        $followMenu
                            .accordion('open', index);
                    }
                },
                h3: function () {
                    var
                        $section = $(this).eq(0),
                        index = $h3.index($section),
                        $followSection = $followMenu.find('.menu > .item'),
                        $activeSection = $followSection.eq(index),
                        inClosedTab = ($(this).closest('.tab:not(.active)').length > 0),
                        anotherExample = ($(this).filter('.another.example').length > 0),
                        isActive = $activeSection.hasClass('active');
                    if (index !== -1 && !inClosedTab && !anotherExample && !isActive) {
                        $followSection.filter('.active')
                            .removeClass('active');
                        $activeSection
                            .addClass('active');
                    }
                }
            },
            createWaypoints: function () {
                $h2.visibility({
                    observeChanges: false,
                    once: false,
                    offset: 50,
                    onTopPassed: handler.activate.h2next,
                    onTopPassedReverse: handler.activate.h2previous
                });

                $h3.visibility({
                    observeChanges: false,
                    once: false,
                    offset: 50,
                    onTopPassed: handler.activate.h3,
                    onBottomPassedReverse: handler.activate.h3
                });
            },
            createMenu: function () {
                var
                    html = '',
                    pageTitle = handler.getPageTitle(),
                    title = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1),
                    $sticky,
                    $rail;
                $h2.each(function (index) {
                    var
                        $currentHeader = $(this),
                        $nextElements = $currentHeader.nextUntil('h2'),
                        $h3Inh2 = $nextElements.find('h3:not(.another)').addBack().filter('h3:not(.another)'),
                        activeClass = (index === 0) ?
                        'active ' :
                        '',
                        text = handler.getText($currentHeader),
                        safeName = handler.getSafeName(text),
                        id = window.escape(safeName),
                        $anchor = $('<a />').addClass('anchor').attr('id', id);
                    html += '<div class="item">';
                    if ($h3Inh2.length === 0) {
                        html += '<a class="' + activeClass + 'title" href="#' + id + '"><b>' + $(this).text() + '</b></a>';
                    } else {
                        html += '<a class="' + activeClass + 'title"><i class="dropdown icon"></i> <b>' + $(this).text() + '</b></a>';
                    }
                    if ($h3Inh2.length > 0) {
                        html += '<div class="' + activeClass + 'content menu">';
                        $h3Inh2
                            .each(function () {
                                var
                                    $title = $(this),
                                    text = handler.getText($title),
                                    safeName = handler.getSafeName(text),
                                    id = window.escape(safeName),
                                    $anchor = $('<a />').addClass('anchor').attr('id', id);
                                if ($title.length > 0) {
                                    html += '<a class="item" href="#' + id + '">' + text + '</a>';
                                }
                            });
                        html += '</div>';
                    }
                    html += '</div>';
                });
                $followMenu = $('<div />')
                    .addClass('ui vertical following fluid accordion text menu')
                    .html(html);
                $sticky = $('<div />')
                    .addClass('ui sticky')
                    .html($followMenu)
                    //.prepend($advertisement)
                    .prepend('<h4 class="ui header">' + title + '</h4>');
                $rail = $('<div />')
                    .addClass('ui dividing right rail')
                    .html($sticky)
                    .prependTo($container);
                $sticky.sticky({
                    silent: true,
                    context: $container,
                    container: $('html'),
                    offset: 30
                });
                $followMenu
                    .accordion({
                        exclusive: false,
                        animateChildren: false,
                        onChange: function () {
                            $('.ui.sticky').sticky('refresh');
                        }
                    })
                    .find('.menu a[href], .title[href]')
                    .on('click', handler.scrollTo);
            },
            scrollTo: function (event) {
                var
                    id = $(this).attr('href').replace('#', ''),
                    $element = $('#' + id),
                    position = $element[0].offsetTop;
                $element.addClass('active');
                $('html, body')
                    .stop()
                    .animate({
                        scrollTop: position
                    }, 500);
                location.hash = '#' + id;
                event.stopImmediatePropagation();
                event.preventDefault();
                return false;
            },
            tryCreateMenu: function (event) {
                if ($(window).width() > 640) {
                    if ($container.length > 0 && $container.find('.following.menu').length === 0) {
                        handler.createMenu();
                        handler.createWaypoints();
                    }
                }
            },
            createAnchors: function () {
                $h2.each(function () {
                    var
                        $section = $(this),
                        text = handler.getText($section),
                        safeName = handler.getSafeName(text),
                        id = window.escape(safeName),
                        $anchor = $('<a />').addClass('anchor').attr('id', id);
                    $section.append($anchor);
                });
                $h3.each(function () {
                    var
                        $title = $(this),
                        text = handler.getText($title),
                        safeName = handler.getSafeName(text),
                        id = window.escape(safeName),
                        $anchor = $('<a />').addClass('anchor').attr('id', id);
                    if ($title.length > 0) {
                        $title.after($anchor);
                    }
                });
            },
        }
    handler.createAnchors();
    handler.tryCreateMenu();
    semantic.handler = handler;
    $('.imageView .item').on("click", handler.showFullImage);
    $('.fullImage').on('click', handler.hideFullImage);
}
$(document).ready(semantic.Ready);