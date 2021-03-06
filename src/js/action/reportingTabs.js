export default [
    {
        "title": "AREA OF CONCERN",
        "slug": "aoc",
        "scores": {},
        "headers": [
            "Reference",
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
                    "",
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
                    "Reference",
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
                    "Reference",
                    "Area of Concern",
                    "Score"
                ],
                "isSelected": true
            },
            {
                "title": "NON/PARTIAL COMPLIANCE",
                "slug": "dep-non-partial-compliance-checkpoints",
                "scores": {},
                "headers": [
                    "Checkpoint",
                    "Score"
                ],
                "rawScore": true,
                "isSelected": false
            }
        ]
    },
    {
        "title": "STANDARD",
        "slug": "std",
        "scores": {},
        "headers": [
            "Reference",
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
                    "Reference",
                    "Measurable Element",
                    "Score"
                ],
                "isSelected": true
            }
        ]
    }
]
