$(document).ready(function() {

  var apiRoot = 'https://shrouded-taiga-70668.herokuapp.com/v1/library/';
  var datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
  var tasksContainer = $('[data-tasks-container]');
   
	// init 3
	 getUsers();

  function createElement(data) {
    var element = $(datatableRowTemplate).clone();

    element.attr('data-task-id', data.userId);
    element.find('[data-task-name-section] [data-task-name-paragraph]').text(data.firstName);
    element.find('[data-task-name-section] [data-task-name-input]').val(data.firstName);

    element.find('[data-task-content-section] [data-task-content-paragraph]').text(data.lastName);
    element.find('[data-task-content-section] [data-task-content-input]').val(data.lastName);

	element.find('[data-task-registrateDate-section] [data-task-registrateDate-paragraph]').text(data.registartionDate);
    element.find('[data-task-registrateDate-section] [data-task-registrateDate-input]').val(data.registartionDate);
	
    return element;
  }

  function handleDatatableRender(data) {
    tasksContainer.empty();
    data.forEach(function(task) {
      createElement(task).appendTo(tasksContainer);
    });
  }

  function getUsers() {
    var requestUrl = apiRoot + 'getUsers';

    $.ajax({
      url: requestUrl,
      method: 'GET',
      success: handleDatatableRender
    });
  }

  function handleTaskUpdateRequest() {
    var parentEl = $(this).parent().parent();
    var userId = parentEl.attr('data-task-id');
    var firstName = parentEl.find('[data-task-name-input]').val();
    var lastName = parentEl.find('[data-task-content-input]').val();
    var registartionDate = parentEl.find('[data-task-registrateDate-input]').val();
    var requestUrl = apiRoot + 'updateUser';

    $.ajax({
      url: requestUrl,
      method: "PUT",
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        userId: userId,
 
	firstName: firstName,
   	lastName: lastName,
 	registartionDate:registartionDate
	
      }),
	    complete: function(data) {
		parentEl.attr('data-task-id', data.userId).toggleClass('datatable__row--editing');
        parentEl.find('[data-task-name-paragraph]').text(taskTitle);
        parentEl.find('[data-task-content-paragraph]').text(taskContent);
       }
    });
	getUsers();
  }

  function handleTaskDeleteRequest() {
    var parentEl = $(this).parent().parent();
    var userId = parentEl.attr('data-task-id');
    var requestUrl = apiRoot + 'deleteUser';

    $.ajax({
      url: requestUrl + '?' + $.param({
        userId: userId
      }),
      method: 'DELETE',
      success: function() {
        parentEl.slideUp(400, function() { parentEl.remove(); });
      }
    })
  }

  function handleTaskSubmitRequest(event) {
    event.preventDefault();

    var firstName = $(this).find('[name="firstName"]').val();
    var lastName = $(this).find('[name="lastName"]').val();
    var registartionDate = $(this).find('[name="registartionDate"]').val();
    var requestUrl = apiRoot + 'createUser';

    $.ajax({
      url: requestUrl,
      method: 'POST',
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
         registartionDate:registartionDate
      }),
      complete: function(data) {
        if(data.status === 200) {
          getUsers();
        }
      }
    });
  }

  function toggleEditingState() {
    var parentEl = $(this).parent().parent();
    parentEl.toggleClass('datatable__row--editing');

    var taskTitle = parentEl.find('[data-task-name-paragraph]').text();
    var taskContent = parentEl.find('[data-task-content-paragraph]').text();

    parentEl.find('[data-task-name-input]').val(taskTitle);
    parentEl.find('[data-task-content-input]').val(taskContent);
  }

  $('[data-task-add-form]').on('submit', handleTaskSubmitRequest);

  tasksContainer.on('click','[data-task-edit-button]', toggleEditingState);
  tasksContainer.on('click','[data-task-edit-abort-button]', toggleEditingState);
  tasksContainer.on('click','[data-task-submit-update-button]', handleTaskUpdateRequest);
  tasksContainer.on('click','[data-task-delete-button]', handleTaskDeleteRequest);
});