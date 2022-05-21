let _essays = [];
let _selectedEssayId;
// fetch all essays from WP
async function getEssays() {
  let response = await fetch("https://blog.debelmose-rideudstyr.dk/wp-json/wp/v2/posts?_embed&per_page=100");
  let data = await response.json();
    console.log(data);
    _essays = data;
    appendEssays(data);
}
// append essays to the DOM - all article page
function appendEssays(essays) {
  let htmlTemplate = "";
  for (let essay of essays) {
    htmlTemplate += /*html*/ `
	  <article onclick="window.scrollTo(0,0), showDetailView('${essay.id}')">
        <img class="article-img" src="${getFeaturedImageUrl(essay)}">
		  <p class="underoverskrift">${essay.acf.underoverskrift}</p>
          <p class="title-h2">${essay.title.rendered}</p>
      </article>
    `;
  }
  document.querySelector('#essays-container').innerHTML = htmlTemplate;
  document.querySelector('#essays-forside').innerHTML = htmlTemplate;
  // scroll to top on window load
  function Scrollup() {
    window.scroll(0,0); 
  }
  window.onload = Scrollup;
}
// get the featured image url
function getFeaturedImageUrl(post) {
  let imageUrl = "";
  if (post._embedded['wp:featuredmedia']) {
    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
  }
  return imageUrl;
}
function showDetailView(id) {
  const essay = _essays.find(essay => essay.id == id);
    document.querySelector("#detailView h2").innerHTML = essay.title.rendered;
    document.querySelector("#detailViewContainer").innerHTML = /*html*/`
	  <article class="article-detail-view" >          
	    <h2 class="article-heading">${essay.title.rendered}</h2>
		<p class="skraaskrift">${essay.acf.skraaskrift}</p>
        <img class="article-cover-img" src="${getFeaturedImageUrl(essay)}">
        <p>${essay.content.rendered}</p>
        <a href="/pages/artikler/" class="btn btn--secondary btn--has-icon-before article-btn">
		  <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--wide icon-arrow-left" viewBox="0 0 20 8">
		    <path d="M4.814 7.555C3.95 6.61 3.2 5.893 2.568 5.4 1.937 4.91 1.341 4.544.781 4.303v-.44a9.933 9.933 0 0 0 1.875-1.196c.606-.485 1.328-1.196 2.168-2.134h.752c-.612 1.309-1.253 2.315-1.924 3.018H19.23v.986H3.652c.495.632.84 1.1 1.036 1.406.195.306.485.843.869 1.612h-.743z" fill="#000" fill-rule="evenodd"></path>
		  </svg>
		  Tilbage til alle artikler
		</a>
      </article>
    `;
    navigateTo("detailView");
  	// scroll to top on window load
	function Scrollup() {
      window.scroll(0,0);
	}
	window.onload = Scrollup;
}
// hide all articles
function hideAllPages() {
  let pages = document.querySelectorAll(".page");
  for (let page of pages) {
    page.style.display = "none";
  }
}
// show page or tab
function showPage(pageId) {
  hideAllPages();
  document.querySelector(`#${pageId}`).style.display = "block";
  setActiveTab(pageId);
}
// sets active tabbar/ menu item
function setActiveTab(pageId) {
  let pages = document.querySelectorAll("nav a");
  for (let page of pages) {
    if (`#${pageId}` === page.getAttribute("href")) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }
  }
}
// navigate to a new view/page by changing href
function navigateTo(pageId) {
  location.href = `#${pageId}`;
}
// set default page or given page by the hash url
// function is called 'onhashchange'
function pageChange() {
  let page = "essays";
  if (location.hash) {
    page = location.hash.slice(1);
  }
  showPage(page);
}
if (location.pathname==="/pages/artikler/"||location.pathname==="/pages/artikler") {
  window.onhashchange = () => pageChange();
  pageChange(); // called by default when the app is loaded for the first time
  getEssays();
  
  if (!_selectedEssayId) {
    navigateTo("essays");
  }
}