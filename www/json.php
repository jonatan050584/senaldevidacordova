<?php
$json = '
   {
      "id": 2,
      "rawId": null,
      "displayName": null,
      "name": {
         "givenName": "Tomas",
         "honorificSuffix": null,
         "formatted": "Tomas Sebastian",
         "middleName": null,
         "familyName": "Sebastian",
         "honorificPrefix": null
      },
      "nickname": null,
      "phoneNumbers": [
         {
            "value": "959 184 554",
            "pref": false,
            "id": 0,
            "type": "mobile"
         }
      ],
      "emails": null,
      "addresses": null,
      "ims": null,
      "organizations": [
         {
            "pref": "false",
            "title": null,
            "name": "Arcangeles",
            "department": null,
            "type": null
         }
      ],
      "birthday": null,
      "note": null,
      "photos": null,
      "categories": null,
      "urls": null
   }
';

$json2 = '[{
		"id":1,
		"rawId":null,
		"displayName": null,
		"name":{
			"givenName": "Tomas",
			"honorificSuffix": null
		}
		
	}]';
$json = json_decode($json2);

var_dump($json);
?>