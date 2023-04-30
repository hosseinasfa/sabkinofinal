$(document).ready(function() {
	var app = new Mapp({
		element: '#app',
		presets: {
			latlng: {
				lat: 32,
				lng: 52,
			},
			zoom: 10,
		},
		// i18n: {
		// 	fa: {
		// 		'marker-title': 'عنوان',
		// 		'marker-description': 'توضیح',
		// 	},
		// 	en: {
		// 		'marker-title': 'Title',
		// 		'marker-description': 'Description',
		// 	},
		// },
		locale: 'en',
        apiKey:'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBiYjEzZmQ0NWU5OTQwZmVjYjllNWIzZTMwZjVmMzY3NmVjODRiMDBlOTVmZTEyZGYzMjM0Njg1YTk5NWY2MmU1NGFjMTk0NDk5ZTk4NjgxIn0.eyJhdWQiOiIxMjMwMiIsImp0aSI6IjBiYjEzZmQ0NWU5OTQwZmVjYjllNWIzZTMwZjVmMzY3NmVjODRiMDBlOTVmZTEyZGYzMjM0Njg1YTk5NWY2MmU1NGFjMTk0NDk5ZTk4NjgxIiwiaWF0IjoxNjEwMzQzOTk0LCJuYmYiOjE2MTAzNDM5OTQsImV4cCI6MTYxMjg0OTU5NCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.Ndo72CCXhg7SVfFtLAvw93noXcmm4ouzawerQjb1zqoqAV6AhhL2N8TJW59q7yCzV4Th7CNpFtVs4ggJZSQQwiDpyIoKuSV0DstpwzuxgG76n6k9eYsbu1CRsxvhxtlmkuk7dzXqCtBnXwQvuawaSxM3HyZfwUJNaTsBgkA9amif3v1jI-8HSrpxz8X3To24pj4vDO_wGObq8R5OjocnppBqbKqXFsHFf59PaCyuyNjo4KWgF8__7l_p9-f8Z_ysFzTMWGeOo0gAos7MA1UTY_hk-yRc-3fvCKM2Klq9pHQg8R9Sj6-bvpqwiB9nKS5kn5FKMSFkbxVQAQDTwyvZFQ',
    });

	app.addLayers();

    var crosshairIcon = {
        iconUrl: 'http://baryabco.ir/resources/assets/images/logo-baryabco.png',
        iconSize:     [20], // size of the icon
        iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
    };

    var marker = app.addMarker({
		name: 'advanced-marker',
		latlng: {
			lat: 37.375,
			lng: 49.759,
		},
		icon: crosshairIcon,
		// popup: {
		// 	title: {
		// 		i18n: 'marker-title',
		// 	},
		// 	description: {
		// 		i18n: 'marker-description',
		// 	},
		// 	// custom: 'Custom popup',
		// 	class: 'marker-class',
		// 	open: true,
		// },
		// pan: false,
		draggable: true,
		history: false,
        popup: false,
        on: {
			click: function() {
				console.log('Click callback');
			},
            // dragPan:function(a){
            //     console.log('change callback');
            // },
			contextmenu: function() {
				console.log('Contextmenu callback');
			},
		},
	});

    // $('#btn_location').click(function () {
    //     var latlng = marker.getLatLng();
    //
    //     console.log(latlng);
    //
    //     console.log(latlng.lat);
    // });
});
