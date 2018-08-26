// We'll alias this property for ease of access..
var panels = chrome.devtools.panels;

panels.elements.createSidebarPane(
	"My Dev Tools Sidebar",
	function (sidebar) {

		function updateContent() {
			// Example 1
			// A simple inline function expression...
			sidebar.setExpression(
				"(function() { return {1:2}; }())"
			);

			// Example 2
			// You can also run a function in the
			// showNodeInfo.js.js within the context
			// of the page by doing the following...
			function getPanelContents() {

				// Return a value based on the page
				// content and the currently selected
				// element pointed to by $0
				return {
					"content": $0.textContent.substr(0, 50)
				}
			}

			sidebar.setExpression(
				"(" + getPanelContents.toString() + ")()"
			);
		}

		updateContent();

		panels
			.elements
			.onSelectionChanged
			.addListener(updateContent);

	});
});