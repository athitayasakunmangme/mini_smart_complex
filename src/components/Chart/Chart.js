var xmlhttp = new XMLHttpRequest();
var url = "http://localhost:2000/pg";
xmlhttp.open("GET", url, true);
xmlhttp.send();

xmlhttp.onreadystatechange = function () {
  // Event listener for the select element
  var selectedValue;
  // document
  //   .getElementById("timeRead")
  //   .addEventListener("change", function (event) {
  //     // Handle select change event
  //     selectedValue = event.target.value;
  //     console.log("Selected value:", selectedValue);
  //   });
  // ------------------------------------------------------------------

  if (this.readyState == 4 && this.status == 200) {
    var data = JSON.parse(this.responseText);
    console.log(data);
    let datasetList = [];

    var dataPush = data.rows.map(function (elem) {
      var dataset = {
        hour: elem.hour,
        direction: elem.direction,
      };
      datasetList.push(dataset);
      // return ;
    });
    console.log(datasetList);
    var timeRead;
    if (selectedValue) {
      timeRead = [selectedValue];
    } else {
      timeRead = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    }
    // let timeRead = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    // let timeRead = [selectedValue];

    const filterDataHandler = (timeRead) => {
      var filterDataInList = [];
      var filterDataOutList = [];

      timeRead.forEach((numberHour) => {
        var endHour = numberHour;
        var startHour = endHour - 1;
        var filterDataIn = datasetList.filter((data) => {
          var hour = parseInt(data.hour.split(":")[0]);
          var minute = parseInt(data.hour.split(":")[1]);

          var direction = data.direction;
          if (direction == "In") {
            return (
              // (hour == startHour && minute > 0) ||
              // (hour == endHour && minute == 0)
              hour == numberHour
            );
          }
        });
        var filterDataOut = datasetList.filter((data) => {
          var hour = parseInt(data.hour.split(":")[0]);
          var minute = parseInt(data.hour.split(":")[1]);

          var direction = data.direction;
          if (direction == "out") {
            return (
              // (hour == startHour && minute > 0) ||
              // (hour == endHour && minute == 0)
              hour == numberHour
            );
          }
        });
        // console.log(filterData);
        // console.log(filterData.length);
        var countDataOut = filterDataOut.length;
        var countDataIn = filterDataIn.length;
        filterDataInList.push(countDataIn);
        filterDataOutList.push(countDataOut);
      });

      return { filterDataInList, filterDataOutList };
    };

    const { filterDataInList, filterDataOutList } = filterDataHandler(timeRead);

    // var filterDataInList = [];
    // var filterDataOutList = [];

    // timeRead.forEach((numberHour) => {
    //   var endHour = numberHour;
    //   var startHour = endHour - 1;
    //   var filterDataIn = datasetList.filter((data) => {
    //     var hour = parseInt(data.hour.split(":")[0]);
    //     var minute = parseInt(data.hour.split(":")[1]);

    //     var direction = data.direction;
    //     if (direction == "In") {
    //       return (
    //         (hour == startHour && minute > 0) ||
    //         (hour == endHour && minute == 0)
    //       );
    //     }
    //   });
    //   var filterDataOut = datasetList.filter((data) => {
    //     var hour = parseInt(data.hour.split(":")[0]);
    //     var minute = parseInt(data.hour.split(":")[1]);

    //     var direction = data.direction;
    //     if (direction == "out") {
    //       return (
    //         (hour == startHour && minute > 0) ||
    //         (hour == endHour && minute == 0)
    //       );
    //     }
    //   });
    //   // console.log(filterData);
    //   // console.log(filterData.length);
    //   var countDataOut = filterDataOut.length;
    //   var countDataIn = filterDataIn.length;
    //   filterDataInList.push(countDataIn);
    //   filterDataOutList.push(countDataOut);
    // });

    // console.log(filterDataInList);
    // console.log(filterDataOutList);

    var hour = data.rows.map(function (elem) {
      return elem.hour;
    });
    var direction = data.rows.map(function (elem) {
      return elem.direction;
    });
    console.log(hour);
    console.log(direction);

    // นับจำนวนข้อมูลที่มี direction เป็น "In"
    var countIn = direction.filter(function (dir) {
      return dir.toLowerCase() === "in";
    }).length;

    // นับจำนวนข้อมูลที่มี direction เป็น "Out"
    var countOut = direction.filter(function (dir) {
      return dir.toLowerCase() === "out";
    }).length;

    console.log("Count In:", countIn);
    console.log("Count Out:", countOut);

    // คำนวณผลลัพธ์ของการลบ
    var result = countIn - countOut;
    console.log("result:", result);

    var timeSeries = timeRead.map((el) => {
      if (el >= 0 && el <= 12) {
        return `${el}:00 AM`;
      }
      if (el >= 13 && el <= 23) {
        return `${el - 12}:00 PM`;
      }
    });

    const ctx = document.getElementById("canvas").getContext("2d");

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels:
          // [
          //   "10:00 AM",
          //   "11:00 AM",
          //   "12:00 PM",
          //   "13:00 PM",
          //   "14:00 PM",
          //   "15:00 PM",
          //   "16:00 PM",
          //   "17:00 PM",
          //   "18:00 PM",
          //   "19:00 PM",
          //   "20:00 PM",
          //   "21:00 PM",
          //   "22:00 PM",
          // ],
          timeSeries,
        datasets: [
          {
            label: "In",
            data: filterDataInList,
            backgroundColor: "#E0C7EE",
            borderWidth: 1,
          },
          {
            label: "Out",
            data: filterDataOutList,
            backgroundColor: "#F3D8D1",
            borderWidth: 1,
          },
          // {
          //   label: "Stil",
          //   data: [
          //     2000,
          //     result,
          //     600,
          //     result,
          //     3000,
          //     result,
          //     result,
          //     1000,
          //     result,
          //     result,
          //     result,
          //     result,
          //   ],
          //   backgroundColor: "#00CD66",
          //   borderWidth: 1,
          // },
        ],
      },

      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        // barThickness: 20, // ลดความกว้างของแท่ง
        // categoryPercentage: 20 // ลดขนาดของแต่ละแท่งในแกน x
      },
    });

    var myButton = document.getElementById("timeRead");

    // Add an event listener to the button for the 'click' event
    myButton.addEventListener("click", function () {
      var selectNumber = document.getElementById("timeRead");
      var selectValue = selectNumber.value;
      var timeRead;
      if (selectValue === "allTime") {
        console.log(`selected value ${selectValue}`);
        timeRead = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
      } else {
        timeRead = [selectValue];
      }

      console.log(timeRead);

      const { filterDataInList, filterDataOutList } =
        filterDataHandler(timeRead);
      // Your code to handle the button click goes here

      // console.log(selectNumber.value);
      // alert("Button clicked!");
      var newDatasets = [
        {
          label: "In",
          data: filterDataInList,
          backgroundColor: "#A8D1E7",
          borderWidth: 2,
        },
        {
          label: "Out",
          data: filterDataOutList,
          backgroundColor: "#2A505A",
          borderWidth: 2,
        },
      ];
      var label;
      if (timeRead[0] >= 0 && timeRead[0] <= 12) {
        label = `${timeRead[0]}:00 AM`;
      }
      if (timeRead[0] >= 13 && timeRead[0] <= 23) {
        label = `${timeRead[0] - 12}:00 PM`;
      }
      myChart.data.datasets = newDatasets;

      if (selectValue === "allTime") {
        myChart.data.labels = timeSeries;
      } else {
        myChart.data.labels = [label];
      }

      myChart.update();
    });
  }
};
