# Aletsch / Massa
Open index.html directly in a browser. Keep the folder together. D3.js 5.9.2 is bundled for offline use. The scene projects hand-authored three-dimensional points into SVG. Drag to orbit and scroll to zoom.

## Try it
Select the river and compare February with July. Turn on Relationships and select the dashed link to the power plant. Turn off Actors to isolate glacier and river. Select the glacier and compare the two field measurement periods.

## Data and extension
data.js holds the example observations. Add another verified measurement to the ice array using the same fields. Annual values are from the GLAMOS reports for 2024 and 2025, appendix A.1, for the actual measurement periods. Each card links to its report. The downloaded GLAMOS fixed-date CSV in your repository uses different periods and is a separate dataset. The river values are FOEN station 2161 monthly means over 1931–2025. They describe a seasonal pattern, not years matching the glacier measurements.

explore.js contains the schematic 3D objects, actor records and relationships. Extend the actors array and its source entries in data.js to add documented relationships. The grid is a spatial reference. Historical outlines, terrain and projections are future additions. Labels and widths are visual encodings, not surveyed geometry. See the linked FOEN and Alpiq sources in the cards.

## User test
Ask someone to find the month with the lowest mean discharge and explain how the power plant connects to the Massa. Observe which element they click and whether they identify the period of the observation.
