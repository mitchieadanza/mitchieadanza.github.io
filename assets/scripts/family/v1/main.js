let control = null;
let event = new Event('loaded');

function updatePersons(query, isPush)
{
  // Make sure query is not null or undefined
  if (!query) {
    query = '';
  }

  // Action of update, whether push or pop
  if (isPush == null || isPush == undefined) {
    isPush = true;
  }

  $.getJSON('https://api.jsonbin.io/v3/b/5e58ed5b09ac43054813b795/latest', function(gedcom)
  {
    'use strict';

    // Update configuration
    let options = new primitives.famdiagram.Config();
    options = Object.assign(options, config);
    gedcom = gedcom.record;

    // Add data and apply preprocesses
    var persons = addRelationships(gedcom.persons, gedcom.relationships);
    persons = getItemizedArray(persons);

    let filteredResults = filterPersons(query, persons);
    options.items = addDisplayDetails(filteredResults.persons);
    options.annotations = filteredResults.annotations;

    // Template to options
    options.defaultTemplateName = template.name;
    options.onItemRender = template.render;
    options.templates = [template];

    $("#tree").animate({
      opacity: 0,
    }, 200, function() {
      $("#tree").empty();
      control = primitives.famdiagram.Control(document.getElementById('tree'), options, function() {
        // Scroll to main item
        let scrollableElement = $('#tree').children().first().children().first();
        $('#tree').children().first().scrollTop((scrollableElement.height() - $(window).height()) / 2);
        $('#tree').children().first().scrollLeft((scrollableElement.width() - $(window).width()) / 2);
        $("#tree").animate({opacity: 1});

        // Update title and URL
        let newTitle = null
        if (filteredResults.main) {
          newTitle = filteredResults.main.names[0].nameForms[0].fullText + ' - Family Tree';
          $(document).prop('title', newTitle);
        }
        if (isPush) {
          window.history.pushState({state: 'new'}, newTitle, window.location.href.split('?')[0] + '?q=' + query);
        }

        // Update family data datestamp
        $('#datestamp').html(gedcom.datestamp);

        // Remove hidden class on full loading family data
        $('#search').removeClass('hidden');
        $('body > footer').removeClass('hidden');
      });
    });
  });
}

$(document).ready(function($) {
  let webTyped = true;

  // Do update on back button
  window.onpopstate = function(event) {
    webTyped = false;
    updatePersons(window.location.get('q'), false);
  };

  // Disable search submission if the input is empty
  $('#search-button').attr('disabled', 'disabled');
  $('#search-form :input').on('keyup', function() {
    let empty = false;

    $('#search-form :input').each(function() {
      empty = $(this).val().length == 0;
    });

    if (empty)
      $('#search-button').attr('disabled', 'disabled');
    else
      $('#search-button').attr('disabled', false);
  });

  // Do update when search form is submitted
  $("#search-form").submit(function(event) {
    event.preventDefault();

    // Get an associative array of just the values.
    var values = {};
    $('#search-form :input').each(function() {
        values[this.name] = $(this).val();
    });

    webTyped = false;
    updatePersons(values['q']);
  });

  // Do update when search form is submitted
  $("#home-button").on('click', function(event) {
    event.preventDefault();

    webTyped = false;
    updatePersons();
  });

  // Update on resize
  let doit = null;
  $(window).resize(function() {
    clearTimeout(doit);
    doit = setTimeout(function() {
      control.update(primitives.common.UpdateMode.Refresh);
    }, 100);
  });

  // Only do a separate update on first site enter
  if (webTyped) {
    updatePersons(window.location.get('q'));
  }
});
