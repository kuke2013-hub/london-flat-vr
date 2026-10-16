/**
 * London flat — version 0.1 architectural tracing.
 * Coordinate pairs are pixels in a 1515 × 992 working view of the supplied plan.
 * This is a provisional tracing of an estate agent's drawing, not a survey.
 * Keep these coordinates editable; DO NOT silently promote estimates to measured facts.
 */
// Derive door aperture positions from the project scale and the user's supplied leaf sizes.
// These remain modelling assumptions, not measurements of the original flat.
const PX_PER_METRE = 85.05;
const FRONT_DOOR_WIDTH = 1.538; // v0.16: 50 cm wider than the previously modelled 1.038 m entrance
const INTERNAL_DOOR_WIDTH = 0.762;
const ENTRANCE_LEFT_X = 605 - FRONT_DOOR_WIDTH * PX_PER_METRE;
const RECEPTION_JOIN_X = 562.5;
const RECEPTION_LEFT_X = RECEPTION_JOIN_X - INTERNAL_DOOR_WIDTH * PX_PER_METRE;
const RECEPTION_RIGHT_X = RECEPTION_JOIN_X + INTERNAL_DOOR_WIDTH * PX_PER_METRE;
const BATHROOM_RIGHT_X = 685 + INTERNAL_DOOR_WIDTH * PX_PER_METRE;
const BEDROOM_CENTRE_Y = 614;
const BEDROOM_TOP_Y = BEDROOM_CENTRE_Y - INTERNAL_DOOR_WIDTH * PX_PER_METRE / 2;
const BEDROOM_BOTTOM_Y = BEDROOM_CENTRE_Y + INTERNAL_DOOR_WIDTH * PX_PER_METRE / 2;

export const PLAN = {
  title: 'Clephane Road — first architectural trace',
  grossInternalAreaM2: 52.58, // printed on the source floor plan, including internal walls
  balconyAreaM2: 5.11,      // source's larger balcony; not modelled yet
  pxPerMetre: PX_PER_METRE,        // calibrated to printed kitchen/reception widths; approximate
  centre: [654, 447],
  ceilingHeight: 2.10,      // CONFIRMED virtual room ceiling height; intentionally unchanged by taller doors
  doorHeight: 2.181,         // user expressly requested +20 cm vs v0.15, despite 2.10 m ceiling (81 mm protrusion)
  doorStandards: {
    entrance: {width: FRONT_DOOR_WIDTH, thickness: 0.044}, // custom 1538 mm wide entrance leaf, 44 mm thick
    internal: {width: INTERNAL_DOOR_WIDTH, thickness: 0.035} // model 762 mm leaf, standard 35 mm thick
  },
  wallOuter: 0.19,          // provisional wall construction thicknesses
  wallInner: 0.11,
  spawn: [568, 632],
  // Floorplate outline follows the main dwelling and ENTRANCE RECESS, excluding balconies.
  outline: [
    [179,145], [1141,411], [1141,659], [605,659], [605,700],
    [ENTRANCE_LEFT_X,700], [ENTRANCE_LEFT_X,756], [250,756], [250,460], [179,460]
  ],
  rooms: [
    { id:'reception', name:'Reception room', subtitle:'5.23 × 3.65 m (plan)', finish:'wood',
      points:[[179,146],[625,268],[RECEPTION_RIGHT_X,567],[RECEPTION_LEFT_X,567],[250,567],[250,460],[179,460]], label:[410,389] },
    { id:'kitchen', name:'Kitchen', subtitle:'2.89 × 2.10 m (plan)', finish:'tile',
      points:[[250,568],[495,568],[495,662],[ENTRANCE_LEFT_X,662],[ENTRANCE_LEFT_X,756],[250,756]], label:[371,661] },
    { id:'bathroom', name:'Bathroom', subtitle:'dimensions provisional', finish:'bath',
      points:[[633,320],[701,290],[774,310],[774,569],[633,569]], label:[706,440] },
    { id:'bedroom', name:'Bedroom', subtitle:'4.46 × 3.60 m (plan)', finish:'carpet',
      points:[[778,310],[1141,411],[1141,659],[778,659]], label:[955,499] },
    { id:'hall', name:'Hall / entrance', subtitle:'dimensions provisional', finish:'wood',
      points:[[RECEPTION_LEFT_X,569],[685,569],[685,575],[778,575],[778,660],[605,660],[605,699],[ENTRANCE_LEFT_X,699],[ENTRANCE_LEFT_X,662],[RECEPTION_LEFT_X,662]],
      label:[665,616] }
  ],
  // Solid walls are uninterrupted line segments. The gaps below are actual door/window openings.
  walls: [
    // Outer perimeter: angled north wall, bedroom far end, southern outline and kitchen return.
    { a:[179,145], b:[1141,411], kind:'outer' },
    { a:[1141,411],b:[1141,458],kind:'outer' },
    { a:[1141,581],b:[1141,659],kind:'outer' },
    { a:[1141,659],b:[605,659],kind:'outer' },
    { a:[605,659],b:[605,700],kind:'outer' },
    { a:[ENTRANCE_LEFT_X,700],b:[ENTRANCE_LEFT_X,756],kind:'outer' },
    { a:[ENTRANCE_LEFT_X,756],b:[250,756],kind:'outer' },
    { a:[250,756],b:[250,460],kind:'outer' },
    { a:[250,460],b:[179,460],kind:'outer' },
    // Between kitchen, reception and entrance hallway.
    { a:[250,568],b:[310,568],kind:'inner' },
    { a:[436,568],b:[RECEPTION_LEFT_X,568],kind:'inner' },
    { a:[RECEPTION_RIGHT_X,568],b:[630,568],kind:'inner' },
    { a:[495,568],b:[495,662],kind:'inner' }, // bottom corner now returns toward widened entrance at y=662
    { a:[495,662],b:[ENTRANCE_LEFT_X,662],kind:'inner' },
    { a:[ENTRANCE_LEFT_X,662],b:[ENTRANCE_LEFT_X,700],kind:'inner' },
    // Bathroom walls; the opening from x=685 is 762 mm at the present drawing scale.
    { a:[629,268],b:[629,569],kind:'inner' },
    { a:[629,569],b:[685,569],kind:'inner' },
    { a:[BATHROOM_RIGHT_X,569],b:[778,569],kind:'inner' },
    // Bedroom west wall, with a door opening into the hall.
    { a:[778,310],b:[778,BEDROOM_TOP_Y],kind:'inner' },
    { a:[778,BEDROOM_BOTTOM_Y],b:[778,659],kind:'inner' }
  ],
  glazing: [
    // Full-height glazed wall to reception balcony. The balcony itself is not yet modelled.
    { a:[179,145],b:[179,460],name:'Reception balcony glazing', mullions:[0.50,0.74] },
    // Full-height French doors / glazing to the small bedroom balcony.
    { a:[1141,458],b:[1141,581],name:'Bedroom balcony glazing', mullions:[0.50] }
  ],
  doors: [
    // Standard-sized model leaves. These openings were adjusted to fit the leaf widths.
    // The front door is closed; the internal room doors are shown open.
    // This nonstandard-width entrance occupies a widened lower hall recess; nearby kitchen corner was adjusted.
    { id:'front', name:'Front entrance door', kind:'entrance', a:[ENTRANCE_LEFT_X,700],b:[605,700],open:false },
    { id:'living-left',name:'Reception double door, left leaf', kind:'internal', a:[RECEPTION_LEFT_X,568],b:[RECEPTION_JOIN_X,568],open:true,swing:-1.07 },
    { id:'living-right',name:'Reception double door, right leaf',kind:'internal',a:[RECEPTION_RIGHT_X,568],b:[RECEPTION_JOIN_X,568],open:true,swing:1.07 },
    { id:'bath',name:'Bathroom door',kind:'internal',a:[BATHROOM_RIGHT_X,569],b:[685,569],open:true,swing:1.45 },
    { id:'bed',name:'Bedroom door',kind:'internal',a:[778,BEDROOM_BOTTOM_Y],b:[778,BEDROOM_TOP_Y],open:true,swing:1.12 }
  ],
  referenceNotes: 'Source plan shows irregular angled upper wall, 52.58 m² GIA, reception and bedroom balcony exits. CONFIRMED virtual ceiling 2.10 m unchanged. Door leaves set to 2181 mm (+200 mm over v0.15), projecting 81 mm through this ceiling in the VR model. Entrance widened another 500 mm to custom 1538 mm / 44 mm thick; lower hall recess and kitchen corner were adjusted. Internal leaves remain 762 mm wide / 35 mm thick. Reception double doors have two 762 mm leaves. Door openings repositioned to match. Actual framing, fire-rating and clear opening are unverified.'
};
