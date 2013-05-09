/**
 *  @author Sarah Osentoski sarah.osentoski@us.bosch.com, Halit Bener Suay benersuay@wpi.edu
 */

/**
 *
 *A toolbar to select what ROS topics are viewed in the scene
 *
 *
 * @constructor
 * @param options - object with the following keys:
 *   *ros - the ROSLIB.Ros connection handle
 *   * rootObject the root object to add the visualization to
 *
 */

ROS3DTOOLBAR.Toolbar = function(options){
  var that=this;
  options=options || {};
  var divID=options.divID;
  this.ros=options.ros;
  this.rootObject=options.rootObject;

  this.currentFixedFrame=null;
  this.createdPopUp=false;

  //create html to fill in div
  var div=document.getElementById(divID);
  var button = document.createElement('button');
  button.setAttribute('id', 'vis-panel-open');
  button.innerHTML='<center> Visualization Control Panel </center>';
  div.appendChild(button);


  //create html to make popup div
  var popupDivObject=document.createElement('div');
  popupDivObject.setAttribute('id', 'visualization-dialog');
  popupDivObject.setAttribute('title', 'Visualization Control Panel');

  //set up inner div
  var visualizationDivObject=document.createElement('div');
  visualizationDivObject.setAttribute('id', 'visualizations');

  //append inner div to popup window
  popupDivObject.appendChild(visualizationDivObject);

  //append everything to the Document.
  document.body.appendChild(popupDivObject);



  //setup callback for button click
  var visPanelOpen = document.getElementById('vis-panel-open');
  visPanelOpen.addEventListener('click', function(){
    if(that.createdPopUp===false){
	console.log(that.createdPopUp);
      var visualizationDiv=document.getElementById('visualization-dialog');
      var dialog = document.createElement('div');
      dialog.setAttribute('id','main-container');
      dialog.setAttribute('title','Visualization Control Panel');

      var upperContainerFixedFrame = document.createElement('div');
      upperContainerFixedFrame.setAttribute('id','upperContFixedFrame');

      var upperContainerAddDisplay = document.createElement('div');
      upperContainerAddDisplay.setAttribute('id','upperContAddDisplay');

      var ffLabel = document.createElement('div');
      ffLabel.setAttribute('id','optLabel');
      ffLabel.innerHTML = 'Fixed Frame';

      var addLabel = document.createElement('div');
      addLabel.setAttribute('id','optLabel');
      addLabel.innerHTML = 'Display Type';

      var tfsDropdown = document.createElement('select');
      tfsDropdown.setAttribute('id','tfsDropdown');

      var displayDropDownId='displayDropDown';
      var addDisplayDropdown = document.createElement('div');
      addDisplayDropdown.setAttribute('id', displayDropDownId);


      var addButton = document.createElement('button');
      addButton.setAttribute('id', 'addDisplayBtn');
      addButton.setAttribute('value', 'Add');
      addButton.innerHTML='Add';

      upperContainerFixedFrame.appendChild(ffLabel);
      upperContainerFixedFrame.appendChild(tfsDropdown);
      upperContainerAddDisplay.appendChild(addLabel);
      upperContainerAddDisplay.appendChild(addDisplayDropdown);
      upperContainerAddDisplay.appendChild(addButton);
      dialog.appendChild(upperContainerFixedFrame);
      dialog.appendChild(upperContainerAddDisplay);

      var midContainer = document.createElement('div');
      midContainer.setAttribute('id','midCont');

      var selectableDisplayList = document.createElement('div');
      selectableDisplayList.setAttribute('id','selectable_vis_list');

      var displayPropertiesList = document.createElement('div');
      displayPropertiesList.setAttribute('id','visualization_parameters');

      midContainer.appendChild(selectableDisplayList);
      dialog.appendChild(midContainer);

      var lowerContainer = document.createElement('div');
      lowerContainer.setAttribute('id','lowerCont');

      var removeButton = document.createElement('input');
      removeButton.setAttribute('type','button');
      removeButton.setAttribute('id','removeDisplayBtn');
      removeButton.setAttribute('value','Remove');

      var applyButton = document.createElement('input');
      applyButton.setAttribute('type','button');
      applyButton.setAttribute('id','applyBtn');
      applyButton.setAttribute('value','Apply');

      lowerContainer.appendChild(removeButton);
      lowerContainer.appendChild(applyButton);
      dialog.appendChild(lowerContainer);

      visualizationDiv.appendChild(dialog);

      //Set up tfList
      var tfListmanager= new ROS3DTOOLBAR.TFListManager({
        ros : that.ros,
        elementId : 'tfsDropdown',
        fixedFrame : '/base_link'
      });

      tfListmanager.on('change', function(frame){
        that.currentFixedFrame=frame;
      });
     
      var displayOptionManager = new ROS3DTOOLBAR.DisplayOptionManager({
        elementId : displayDropDownId
      });

      that.createdPopUp=true;
    }
    //Jquery popup
    $('#visualization-dialog').dialog({
      closeOnEscape: false,
      height: 'auto',
      width: 'auto',
      resizable: 'false'
    });
  });


};