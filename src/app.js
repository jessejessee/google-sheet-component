class GoogleSheet extends HTMLElement {
	
	constructor()
	{
		super();
		this.attachShadow({mode: 'open'});
		this._base_url = 'https://sheets.googleapis.com/v4/spreadsheets/';
	}

	static get observedAttributes()
	{
		return ['api-token','sheet-name','title','tab-name'];
	}

	get api_token()
	{
		return (this.hasAttribute('api-token')) ? this.getAttribute('api-token') : null;
	}

	set api_token(api_token)
	{
		this.setAttribute('api-token',api_token);
	}

	get sheet_id()
	{
		return (this.hasAttribute('sheet-id')) ? this.getAttribute('sheet-id') : null;
	}

	set sheet_id(id)
	{
		this.setAttribute('sheet-id',id);
	}

	get tab_name()
	{
		return (this.hasAttribute('tab-name')) ? this.getAttribute('tab-name') : null;
	}

	set tab_name(name)
	{
		this.setAttribute('tab-name',name);
	}

	/**
	 * connectedCallback - Called when element is inserted into DOM.
	 */
	connectedCallback()
	{
		// Access Shadow DOM to add elements.
		const ShadowDom = this.shadowRoot;

		// Create parernt table element.
		const $table = document.createElement('table');

		// Retrieve sheet data from Google.
		const api_request_url = this.generateRequestUrl(this._base_url,this.sheet_id,this.tab_name,this.api_token);
		fetch(api_request_url)
			.then((response) => response.json())
			.then((data) => {
				data.values.forEach((row) => {

					// Add row to table.
					const $row = document.createElement('tr');
					$table.appendChild($row);

					// Add column data to row.
					row.forEach((column) => {
						const $column = document.createElement('td');
						$column.innerText = column;
						$row.appendChild($column);
					});
				});
			});

		// Add elements to DOM.
		ShadowDom.append($table);
	}

	/**
	 * generateRequestUrl - Formats provided parameters into usable request URL.
	 * 
	 * @param {string} base_url 
	 * @param {string} sheet_id 
	 * @param {string} tab_name 
	 * @param {string} api_token 
	 * @returns string
	 */
	generateRequestUrl(base_url, sheet_id, tab_name, api_token)
	{
		return base_url + sheet_id + '/values/' + tab_name + '?key=' + api_token;
	}
}

customElements.define('google-sheet',GoogleSheet)