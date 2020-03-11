$sticky = $('.ui.sticky');
$sticky.sticky({
    context: '#main'
});
$accordion = $('#main .sticky .accordion');
$accordion.accordion({
    selector: {
        trigger: '.title .icon'
    }
});
$menuItems = $accordion.find('.item');

$sectionHeaders = $('h2.ui.dividing.header');
var section = function() {
    var
        $section = $(this),
        index = $sectionHeaders.index($section),
        $followSection = $accordion.children('.item'),
        $activeSection = $followSection.eq(index),
        isActive = $activeSection.hasClass('active');
    if (!isActive) {
        $followSection.filter('.active')
            .removeClass('active');
        $activeSection
            .addClass('active');
        $accordion
            .accordion('open', index);
    }
}
var previous = function() {
    var
        $section = $menuItems.filter('.active'),
        index = $menuItems.index($section);
    if ($section.prev().length > 0) {
        $section
            .removeClass('active')
            .prev('.item')
            .addClass('active');
        $accordion
            .accordion('open', index - 1);
    }
}

$('h2.ui.dividing.header').visibility({
    observeChanges: false,
    once: false,
    offset: 50,
    onTopPassed: section,
    onTopPassedReverse: previous
});