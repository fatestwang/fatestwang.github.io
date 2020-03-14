showFullImage = function () {
    $('.fullImage').find('img').attr('src', $(this).find('img').attr("src"));
    $('.fullImage').css('display', 'block');
    $('.fullImage img').css('max-width', '100%').css('max-height', '100%');
};
hideFullImage = function () {
    $('.fullImage').css('display', 'none');
    $('.fullImage img').css('max-width', '0%').css('max-height', '0%');
};
$('.imageView .item').on("click", showFullImage);
$('.fullImage').on('click', hideFullImage);