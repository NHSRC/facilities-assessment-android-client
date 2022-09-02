export const ThemesTabTitle = "THEMES";
export const DeptTabTitle = "DEPT";
export const AOCTabTitle = "AREA OF CONCERN";
export const StdTabTitle = "STANDARD";

export default [
    {
        "title": AOCTabTitle,
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
                "title": "DEPT",
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
                "title": StdTabTitle,
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
        "title": "DEPT",
        "slug": "dep",
        "scores": {},
        "headers": [
            "Department",
            "Score"
        ],
        "isSelected": false,
        "drillDown": [
            {
                "title": AOCTabTitle,
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
        "title": StdTabTitle,
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

export const ThemeTab = {
    "title": ThemesTabTitle,
    "slug": "theme",
    "scores": {},
    "headers": [
        "Theme",
        "Measurable Element",
        "Checkpoint",
        "Score"
    ],
    "isSelected": false,
    "drillDown": [
    ]
};
