import "./jquery-3.7.1.js";
import "./slick/slick.min.js";

function initializeSlider() {
    $(".slide_here").slick({
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>'
    });

    if ($(".slide_here").find(".slick-slide").length === 0) {
        $(".slide_here").find(".slick-dots").hide();
    } else {
        $(".slide_here").find(".slick-dots").show();
    }
}
let slideIndex = 0;

initializeSlider();

$(".slide_here").on("afterChange", function (event, slick, currentSlide) {
    slideIndex = currentSlide;
}); 


$(".add_file").on("click", function () {
    let fileUpload = $("#file_upload")[0];
    let mainHeading = $("#main_heading").val();
    let subHeading = $("#sub_heading").val();

    if (fileUpload.files.length > 0 && mainHeading && subHeading) {
        let file = fileUpload.files[0];
        let reader = new FileReader();
         reader.readAsDataURL(file);
        reader.onload = function (e) {
            let fileType = file.type.split('/')[0];
            let slideContent = '';
            if (fileType === "image") {
                slideContent = '<div><img src="' + e.target.result + '"><h1>' + mainHeading + '</h1><p>' + subHeading + '</p></div>';
            } else if (fileType === "video") {
                slideContent = '<div><video  autoplay loop src="' + e.target.result + '"></video><h1>' + mainHeading + '</h1><p>' + subHeading + '</p></div>';
            }
            let currentSlides = $(".slide_here").slick("getSlick").$slides;
            let insertIndex = slideIndex; 
            let newSlides = [];
            for (let i = 0; i < insertIndex; i++) {
                newSlides.push(currentSlides[i]);
            }
            newSlides.push($(slideContent));
            for (let i = insertIndex; i < currentSlides.length; i++) {
                newSlides.push(currentSlides[i]);
            }
            $(".slide_here").slick("unslick");
            $(".slide_here").html(newSlides);
            initializeSlider();
            $(".slide_here").slick("slickGoTo", insertIndex);

            clear();
        };
       
    } else {
        alert("Please select a file and enter main and sub heading.");
    }
});

$(".remove_file").on("click", function () {
    let totalSlides = $(".slide_here").slick("getSlick").slideCount;
    if (totalSlides > 1) {
        $(".slide_here").slick("slickRemove", slideIndex);
        console.log("remove");
    } else {
        $(".error_div").show()
    }
});


let contentElementToUpdate;
let originalMainHeading;
let originalSubHeading;
$(".slide_here").on("click", "img", function() {
    originalMainHeading = $(this).siblings("h1").text();
    originalSubHeading = $(this).siblings("p").text();
    contentElementToUpdate = $(this).parent();
    openPreviewModal(originalMainHeading, originalSubHeading);
});


$(".slide_here").on("click", "video", function() {
    originalMainHeading = $(this).siblings("h1").text();
    originalSubHeading = $(this).siblings("p").text();
    contentElementToUpdate = $(this).parent(); 
    openPreviewModal(originalMainHeading, originalSubHeading);
});

// Function to handle preview modal opening with content details
function openPreviewModal(mainHeading, subHeading) {
    $("#edit_main_heading").val(mainHeading);
    $("#edit_sub_heading").val(subHeading);
    $(".preview_modal").css("display", "block");
}

// Save changes in the preview modal
$(".save_changes").on("click", function() {
    let newMainHeading = $("#edit_main_heading").val();
    let newSubHeading = $("#edit_sub_heading").val();
    
    if (!newMainHeading) {
        newMainHeading = originalMainHeading;
    }
    

    let newFileUpload = $("#update_file")[0];

    if (newFileUpload.files.length > 0) {
        let newFile = newFileUpload.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(newFile);
        reader.onload = function (e) {
            let fileType = newFile.type.split('/')[0];
            let newContent = '';

            if (fileType === 'image') {
                newContent = '<div><img src="' + e.target.result + '"><h1>' + newMainHeading + '</h1><p>' + newSubHeading + '</p></div>';
            } else if (fileType === 'video') {
                newContent = '<div><video  autoplay loop src="' + e.target.result + '"></video><h1>' + newMainHeading + '</h1><p>' + newSubHeading + '</p></div>';
            }

            
            contentElementToUpdate.html(newContent);
            contentElementToUpdate.find('h1').text(newMainHeading);
            contentElementToUpdate.find('p').text(newSubHeading);

           
            $(".preview_modal").css("display", "none");

           
            $("#update_file").val("");
        };
       
    } else {
        
        contentElementToUpdate.find("h1").text(newMainHeading);
        contentElementToUpdate.find("p").text(newSubHeading);

       
        $(".preview_modal").css("display", "none");
    }
});




// Close preview modal when clicking on close button
$(".preview_modal .close").on("click", function() {
    $(".preview_modal").css("display", "none");
});

$('#update_file').on("change",function(){
    show_image_video()
})


//Show image selected in preview box
function show_image_video(){
    let selcted = $('#update_file')[0]
    if (selcted.files.length > 0) {
        let newFile = selcted.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(newFile);
        reader.onload = function (e) {
            let fileType = newFile.type.split('/')[0];
            let newContent = '';

            if (fileType === 'image') {
                newContent = '<img src="' + e.target.result + '">';
            } else if (fileType === 'video') {
                newContent = '<video  autoplay loop src="' + e.target.result + '"></video>';
            }

            
            $('.img_video_preview').html(newContent);          
            
        };
       
    }
    console.log("new")
}


// Add these lines to your clear function to clear preview modal fields
function clear(){
    $('#file_upload').val("");
    $('#main_heading').val("");
    $('#sub_heading').val("");
}


$(".error_div_close").on("click",function(){
    $(".error_div").hide()
})