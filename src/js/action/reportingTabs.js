export default [
    {
        "title": "AREA OF CONCERN",
        "slug": "aoc",
        "scores": {},
        "headers": [
            "Area of Concern",
            "Score"
        ],
        "isSelected": true,
        "drillDown": [
            {
                "title": "DEPARTMENT",
                "slug": "aoc-dep",
                "scores": {},
                "headers": [
                    "Department",
                    "Score"
                ],
                "isSelected": true
            },
            {
                "title": "STANDARD",
                "slug": "aoc-std",
                "scores": {},
                "headers": [
                    "Standard",
                    "Score"
                ],
                "isSelected": false
            }
        ]
    },
    {
        "title": "DEPARTMENT",
        "slug": "dep",
        "scores": {},
        "headers": [
            "Department",
            "Score"
        ],
        "isSelected": false,
        "drillDown": [
            {
                "title": "AREA OF CONCERN",
                "slug": "dep-aoc",
                "scores": {},
                "headers": [
                    "Area of Concern",
                    "Score"
                ],
                "isSelected": true
            }
        ]
    },
    {
        "title": "STANDARD",
        "slug": "std",
        "scores": {},
        "headers": [
            "Standard",
            "Score"
        ],
        "isSelected": false,
        "drillDown": [
            {
                "title": "MEASURABLE ELEMENT",
                "slug": "std-me",
                "scores": {},
                "headers": [
                    "Measurable Element",
                    "Score"
                ],
                "isSelected": true
            }
        ]
    }
]
