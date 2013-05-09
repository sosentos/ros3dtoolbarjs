/**
* @author Sarah Osentoski - sarah.osentoski@us.bosch.com
*/

var ROS3DTOOLBAR= ROS3DTOOLBAR || {
    REVISION : '1'
};
/**
 *  @author Sarah Osentoski sarah.osentoski@us.bosch.com, Halit Bener Suay benersuay@wpi.edu
 */

/**
 *
 *Supplies a list of TF Topics
 *
 *
 * @constructor
 * @param options - object with the following keys:
 *   *ros - the ROSLIB.Ros connection handle
 *   * rootObject the root object to add the visualization to
 *
 */

ROS3DTOOLBAR.DisplayOptionManager = function(options){
  var that=this;
  options=options || {};
  this.elementId=options.elementId;


  //List of types we can display
  this.displayoptions=[];
  this.displayoptions.push(['Axes', 'AxesNode']);
  this.displayoptions.push(['Camera', 'CameraNode']);
  //this.displayoptions.push(['Snapshot', "SnapshotNode"]);
  this.displayoptions.push(['Grid', 'GridNode']);
  //this.displayoptions.push(['GridCells', "GridCellsNode"]);
  //this.displayoptions.push(['Image', "ImageNode"]);
  this.displayoptions.push(['InteractiveMarker', 'InteractiveMarkerNode']);
  this.displayoptions.push(['LaserScan', 'LaserScanNode']);
  //this.displayoptions.push(['Map', "MapNode"]);
  this.displayoptions.push(['Marker', 'MarkerNode']);
  //this.displayoptions.push(['Path', "PathNode"]);
  //this.displayoptions.push(['Pose',"PoseNode"]);
  //this.displayoptions.push(['PoseArray', "PoseArrayNode"]);
  this.displayoptions.push(['PointCloud2', 'PointCloud2Node']);
  //this.displayoptions.push(['Polygon', "PolygonNode"]);
  //this.displayoptions.push(['Odometry', "OdometryNode"]);
  //this.displayoptions.push(['Range', "RangeNode"]);
  this.displayoptions.push(['RobotModel', 'RobotModelNode']);
  this.displayoptions.push(['TF', 'TFNode']);

  var addDisplayDropdown = document.createElement('select');
  addDisplayDropdown.setAttribute('id','addDisplayDropdown');

  //populate the addItemDropdown List
    for(var i=0; i<this.displayoptions.length; i++){
      // For each item in the list new option element
      var opt = document.createElement('option');
      opt.setAttribute('value',this.displayoptions[i][0]);
      opt.setAttribute('title',this.displayoptions[i][0]);
      opt.innerHTML = this.displayoptions[i][0];

      // And then append the option element to our list
      addDisplayDropdown.appendChild(opt);
    }
    var container=document.getElementById(this.elementId);
    container.appendChild(addDisplayDropdown);
  //add event listener that handles changes to frame
  addDisplayDropdown.addEventListener('change', function(){
//    var displays = this.options;
    var i = this.selectedIndex;
    
    var selectedDisplay=that.displayoptions[i];
    console.log(selectedDisplay);
    that.emit('change', selectedDisplay);
    });

  };

ROS3DTOOLBAR.DisplayOptionManager.prototype.__proto__=EventEmitter2.prototype;
  
/**
 *  @author Sarah Osentoski sarah.osentoski@us.bosch.com, Halit Bener Suay benersuay@wpi.edu
 */

/**
 *
 *Supplies a list of TF Topics
 *
 *
 * @constructor
 * @param options - object with the following keys:
 *   *ros - the ROSLIB.Ros connection handle
 *   * rootObject the root object to add the visualization to
 *
 */

ROS3DTOOLBAR.TFListManager = function(options){
  var that=this;
  options=options || {};
  this.ros=options.ros;
  this.elementId=options.elementId;
  this.fixedFrame=options.fixedFrame;


  var tfListerClient= new ROSLIB.Service({
    ros : that.ros,
    name : '/tf_lister/request_list',
    serviceType : 'tf_lister/TfLister'

  });

    console.log(this.fixedFrame);
  var request = new ROSLIB.ServiceRequest({});

  tfListerClient.callService(request, function(response) {

    // This is the element we will populate with the tfs published
    var dropdown = document.getElementById(that.elementId);

    // Clear the list first
    dropdown.options.length = 0;

    // Get the list from the response
    var tfs = response.tf_list;

    // Set a helper variable
    var foundMatchingFrame = false;

    // Add all available TFs in the list
      console.log(tfs.length);
    for(var f=0; f < tfs.length; f++){

      // For each tf found, create a new option element
      var opt = document.createElement('option');
      opt.setAttribute('value',tfs[f]);
      opt.setAttribute('title',tfs[f]);
      opt.innerHTML = tfs[f];

      // And then append the option element to our list
      dropdown.appendChild(opt);

      // Check if the hard-coded fixed frame is equal to this specific option
      // If it is, then set the index to show to the user
      if(tfs[f] === that.fixedFrame){
        dropdown.selectedIndex = f;
        foundMatchingFrame = true;
	that.emit('change', that.fixedFrame);
      }
    }

    // If the hard-coded frame was not found in the list set fixed frame to the first item in the list
    if(!foundMatchingFrame){
      dropdown.selectedIndex = 0;
      that.fixedFrame=dropdown.options[0].value;
      that.emit('change', that.fixedFrame);
    }
  });

  var dropdown=document.getElementById(this.elementId);
  
  //add event listener that handles changes to frame
  dropdown.addEventListener('change', function(){
    var tfs = document.getElementById(that.elementId).options;
    var i = document.getElementById(that.elementId).selectedIndex;
    console.log('Your current fixed frame is...');
    console.log(tfs[i].value);
    
    that.fixedFrame=tfs[i].value;
    that.emit('change', that.fixedFrame);
    });

  };
  ROS3DTOOLBAR.TFListManager.prototype.__proto__=EventEmitter2.prototype;
  
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

  //List of types we can display
  this.displayoptions=[];
  this.displayoptions.push(['Axes', 'AxesNode']);
  this.displayoptions.push(['Camera', 'CameraNode']);
  //this.displayoptions.push(['Snapshot', "SnapshotNode"]);
  this.displayoptions.push(['Grid', 'GridNode']);
  //this.displayoptions.push(['GridCells', "GridCellsNode"]);
  //this.displayoptions.push(['Image', "ImageNode"]);
  this.displayoptions.push(['InteractiveMarker', 'InteractiveMarkerNode']);
  this.displayoptions.push(['LaserScan', 'LaserScanNode']);
  //this.displayoptions.push(['Map', "MapNode"]);
  this.displayoptions.push(['Marker', 'MarkerNode']);
  //this.displayoptions.push(['Path', "PathNode"]);
  //this.displayoptions.push(['Pose',"PoseNode"]);
  //this.displayoptions.push(['PoseArray', "PoseArrayNode"]);
  this.displayoptions.push(['PointCloud2', 'PointCloud2Node']);
  //this.displayoptions.push(['Polygon', "PolygonNode"]);
  //this.displayoptions.push(['Odometry', "OdometryNode"]);
  //this.displayoptions.push(['Range', "RangeNode"]);
  this.displayoptions.push(['RobotModel', 'RobotModelNode']);
  this.displayoptions.push(['TF', 'TFNode']);


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

/*      var addDisplayDropdown = document.createElement('select');
      addDisplayDropdown.setAttribute('id','addDisplayDropdown');

      // Populate the addItemDropdown List.
      console.log(that.displayoptions.length);
      for(var i=0; i < that.displayoptions.length; i++) {
        // For each item in the list new option element
        var opt = document.createElement('option');
        opt.setAttribute('value',that.displayoptions[i][0]);
        opt.setAttribute('title',that.displayoptions[i][0]);
        opt.innerHTML = that.displayoptions[i][0];

        // And then append the option element to our list
        addDisplayDropdown.appendChild(opt);
      }
*/


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