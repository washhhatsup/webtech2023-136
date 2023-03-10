let authorCount = 0;
let lastClickedAuthor = "";

// Fetch Data and display
fetch("https://wt.ops.labs.vu.nl/api23/54db8963")
  .then(function (response) {
    return response.json();
  })
  .then(function (lists) {
    let placeholder = document.querySelector("#showData");
    let out = "";
    for (let list of lists) {
      out += `
         <tr>
            <td> <img src='${list.image}'> </td>
            <td> <button class='author-button' data-author='${list.author}'> ${list.author} </button> </td>
            <td>${list.alt}</td>
            <td>${list.tags}</td>
            <td>${list.description}</td>
         </tr>
      `;
    }
    placeholder.innerHTML = out;
    addEventListeners();
    searchBox();
  })
  .catch(function (error) {
    console.log("Error: " + error);
  });

// New data entry from submit button
$("#authorData").submit(function (e) {
  const tableBody = $(".models").find("tbody");
  e.preventDefault();
  $.ajax({
    url: "https://wt.ops.labs.vu.nl/api23/54db8963", //the correct URL
    method: "POST",
    data: $("#authorData").serialize(),
  })
    .done(function (response) {
      $.ajax({
        url: response.URL, // use the response data
        method: "GET",
      })
        .done(function (data) {
          tableBody.append(`
              <tr class='bodyt'>
                  <td><img alt='${data.author} ${data.alt}' src='${data.image}' class='phone-img'></td>
                  <td>
                    <button class='author-button' data-author='${data.author}'>
                      ${data.author}
                    </button>
                  </td>
                  <td>${data.alt}</td>
                  <td>${data.tags}</td>
                  <td>${data.description}</td>
              </tr>
          `);
          addEventListeners();
        })
        .done(function () {
          $(".inputForm").val("");
        });
    });
});

// Reset data to the original state
$("#resetBtn").submit(function (e) {
  const tableBody = $(".models").find("tbody");
  e.preventDefault();
  $.ajax({
    url: "https://wt.ops.labs.vu.nl/api23/54db8963/reset",
    method: "GET",
  }).done(function () {
    tableBody.empty();
    getModels();
    addEventListeners();
  });
});

// Filter table from author's name button
function addEventListeners() {
  document.querySelectorAll(".author-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      let activeAuthor = this.dataset.author;
      if (activeAuthor === lastClickedAuthor) {
        showAllRows();
        lastClickedAuthor = "";
      } else {
        hideOthers(activeAuthor);
        lastClickedAuthor = activeAuthor;
      }
    });
  });
}

function showAllRows() {
  let tableRows = document.querySelectorAll("#showData tr");
  for (let i = 0; i < tableRows.length; i++) {
    tableRows[i].style.display = "";
  }
}

function hideOthers(activeAuthor) {
  let tableRows = document.querySelectorAll("table tbody tr");
  for (let i = 0; i < tableRows.length; i++) {
    let authorButton = tableRows[i].querySelector(".author-button");
    if (authorButton && authorButton.dataset.author !== activeAuthor) {
      tableRows[i].style.display = "none";
    } else if (authorButton) {
      tableRows[i].style.display = "";
    }
  }
}

// Enter author name from the search box and filter the table
function searchBox() {
  let input, filter, table, tr, td, txtValue;
  input = document.getElementById("newEntry");
  filter = input.value.toUpperCase();
  table = document.getElementById("showData");
  tr = table.getElementsByTagName("tr");

  for (let i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}






