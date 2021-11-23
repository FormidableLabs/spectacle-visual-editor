import 'evergreen-ui';

/*
  This is a temporary type declaration file, necessary as evergreen-ui does not current export a typed theme object
  https://github.com/segmentio/evergreen/issues/1209

  Types generated using: https://quicktype.io/typescript
*/

declare module 'evergreen-ui' {
  interface Theme extends CustomTheme {}
}

interface CustomTheme {
  tokens: Tokens;
  colors: Colors;
  fills: Fills;
  intents: Intents;
  radii: string[];
  shadows: string[];
  fontFamilies: FontFamilies;
  fontSizes: string[];
  fontWeights: FontWeights;
  letterSpacings: LetterSpacings;
  lineHeights: string[];
  zIndices: ZIndices;
  components: Components;
}

interface Colors {
  gray900: string;
  gray800: string;
  gray700: string;
  gray600: string;
  gray500: string;
  gray400: string;
  gray300: string;
  gray200: string;
  gray100: string;
  gray90: string;
  gray75: string;
  gray50: string;
  blue900: string;
  blue800: string;
  blue700: string;
  blue600: string;
  blue500: string;
  blue400: string;
  blue300: string;
  blue200: string;
  blue100: string;
  blue50: string;
  blue25: string;
  red700: string;
  red600: string;
  red500: string;
  red300?: string;
  red100: string;
  red25: string;
  green900: string;
  green800: string;
  green700: string;
  green600: string;
  green500: string;
  green400: string;
  green300: string;
  green200: string;
  green100: string;
  green25: string;
  orange700: string;
  orange500: string;
  orange100: string;
  orange25: string;
  purple600: string;
  purple100: string;
  teal800: string;
  teal100: string;
  yellow800: string;
  yellow100: string;
  muted: string;
  default: string;
  dark?: string;
  selected?: string;
  tint1?: string;
  tint2?: string;
  overlay?: string;
  yellowTint?: string;
  greenTint?: string;
  orangeTint?: string;
  redTint?: string;
  blueTint?: string;
  purpleTint?: string;
  tealTint?: string;
  border?: Border;
  icon?: Icon;
  text?: Text;
  white: string;
}

interface Border {
  default: string;
  muted: string;
}

interface Icon {
  default: string;
  muted: string;
  disabled: string;
  selected: string;
}

interface Text {
  danger: string;
  success: string;
  info: string;
}

interface Components {
  Alert: Alert;
  Avatar: Alert;
  Badge: Badge;
  Button: Button;
  Card: Card;
  Checkbox: Checkbox;
  Code: Code;
  DialogBody: DialogBody;
  DialogFooter: Dialog;
  DialogHeader: Dialog;
  Group: Group;
  Heading: Heading;
  Icon: Alert;
  InlineAlert: Alert;
  Input: Input;
  Label: Heading;
  List: List;
  Link: Link;
  MenuItem: MenuItem;
  Option: Option;
  Pane: Alert;
  Paragraph: ParagraphClass;
  Radio: Checkbox;
  Select: Select;
  Spinner: Spinner;
  Switch: Switch;
  Tab: Tab;
  Table: Table;
  TableCell: TableCell;
  TableHead: TableHead;
  TableRow: TableRow;
  TagInput: TagInput;
  Text: TextClass;
  TextDropdownButton: TextDropdownButton;
  Tooltip: Tooltip;
}

interface Alert {
  appearances: SizesClass;
  sizes: SizesClass;
}

interface SizesClass {}

interface Badge {
  baseStyle: BadgeBaseStyle;
  appearances: SizesClass;
  sizes: SizesClass;
}

interface BadgeBaseStyle {
  height: number;
  paddingY: number;
  paddingX: number;
  borderRadius: string;
  fontSize: string;
  textAlign: string;
  textDecoration: string;
  textTransform: string;
}

interface Button {
  baseStyle: ButtonBaseStyle;
  appearances: ButtonAppearances;
  sizes: ButtonSizes;
}

interface ButtonAppearances {
  default: PurpleDefault;
  minimal: Minimal;
  destructive: Destructive;
}

interface PurpleDefault {
  backgroundColor: Color;
  _disabled: PurpleDisabled;
  _hover: None;
  _active: None;
}

interface None {
  backgroundColor: string;
}

interface PurpleDisabled {
  color: string;
  borderColor: string;
}

export enum Color {
  ColorsGray600 = 'colors.gray600',
  White = 'white'
}

interface Destructive {
  backgroundColor: string;
  borderColor: string;
  color: Color;
  _hover: DisabledClass;
  _disabled: DisabledClass;
  _focus: DestructiveFocus;
  _active: DisabledClass;
}

interface DisabledClass {
  backgroundColor: string;
  borderColor: string;
}

interface DestructiveFocus {
  backgroundColor: string;
  boxShadow: string;
  borderColor: string;
}

interface Minimal {
  backgroundColor: string;
  _disabled: MinimalDisabled;
  _hover: None;
  _active: None;
}

interface MinimalDisabled {
  color: string;
  opacity: number;
}

interface ButtonBaseStyle {
  fontFamily: FontFamily;
  border: string;
  borderRadius: string;
  transition: string;
  _focus: BaseStyleFocus;
  _disabled: FluffyDisabled;
}

interface FluffyDisabled {
  cursor: string;
  pointerEvents: string;
}

interface BaseStyleFocus {
  boxShadow: string;
}

export enum FontFamily {
  FontFamiliesUI = 'fontFamilies.ui'
}

interface ButtonSizes {
  small: PurpleLarge;
  medium: PurpleLarge;
  large: PurpleLarge;
}

interface PurpleLarge {
  height: number;
  minWidth: number;
  fontSize: string;
  lineHeight: string;
  paddingLeft: number;
  paddingRight: number;
}

interface Card {
  baseStyle: CardBaseStyle;
  appearances: SizesClass;
  sizes: SizesClass;
}

interface CardBaseStyle {
  borderRadius: string;
}

interface Checkbox {
  baseStyle: SizesClass;
  appearances: PurpleAppearances;
  sizes: SizesClass;
}

interface PurpleAppearances {
  default: FluffyDefault;
}

interface FluffyDefault {
  _base: Base;
  _disabled: TentacledDisabled;
  _hover: SizesClass;
  _focus: SizesClass;
  _active: Active;
  _checked: Base;
  _checkedHover: Base;
  _checkedActive: Base;
  _checkedDisabled: Base;
}

interface Active {
  background: string;
}

interface Base {
  color: Color;
  background: string;
}

interface TentacledDisabled {
  cursor: string;
  background: string;
  color: string;
}

interface Code {
  baseStyle: SizesClass;
  appearances: FluffyAppearances;
  sizes: SizesClass;
}

interface FluffyAppearances {
  default: TentacledDefault;
}

interface TentacledDefault {
  backgroundColor: string;
  boxShadow: string;
  paddingX: number;
  paddingY: number;
  borderRadius: string;
}

interface DialogBody {
  baseStyle: DialogBodyBaseStyle;
}

interface DialogBodyBaseStyle {
  paddingY: number;
  paddingX: number;
}

interface Dialog {
  baseStyle: DialogFooterBaseStyle;
}

interface DialogFooterBaseStyle {
  paddingX: number;
  paddingBottom: number;
  paddingTop: number;
}

interface Group {
  baseStyle: GroupBaseStyle;
  appearances: SizesClass;
  sizes: SizesClass;
}

interface GroupBaseStyle {
  _child: Child;
  _firstChild: FirstChild;
  _middleChild: MiddleChild;
  _lastChild: LastChild;
}

interface Child {
  '&:focus': ActiveClass;
  '&:active': ActiveClass;
}

interface ActiveClass {
  zIndex: string;
}

interface FirstChild {
  borderTopRightRadius: number;
  borderBottomRightRadius: number;
}

interface LastChild {
  borderTopLeftRadius: number;
  borderBottomLeftRadius: number;
  marginLeft: string;
}

interface MiddleChild {
  borderRadius: number;
  marginLeft: string;
}

interface Heading {
  baseStyle: HeadingBaseStyle;
  appearances: SizesClass;
  sizes: { [key: string]: Paragraph };
}

interface HeadingBaseStyle {
  color: string;
  fontFamily: string;
  fontWeight: string;
}

interface Paragraph {
  fontSize: string;
  textTransform?: string;
  lineHeight: string;
  letterSpacing: string;
  fontFamily?: FontFamily;
  color?: string;
  fontWeight?: FontWeightEnum | number;
}

export enum FontWeightEnum {
  FontWeightsBold = 'fontWeights.bold',
  FontWeightsNormal = 'fontWeights.normal'
}

interface Input {
  baseStyle: InputBaseStyle;
  appearances: InputAppearances;
  sizes: InputSizes;
}

interface InputAppearances {
  default: StickyDefault;
  none: None;
}

interface StickyDefault {
  backgroundColor: Color;
  borderColor: string;
  _focus: PurpleFocus;
  _invalid: Invalid;
}

interface PurpleFocus {
  zIndex: string;
  boxShadow: string;
  borderColor: string;
}

interface Invalid {
  borderColor: string;
}

interface InputBaseStyle {
  borderRadius: string;
  fontFamily: FontFamily;
  lineHeight: string;
  fontSize: string;
  border: string;
  color: string;
  paddingX: number;
  transition: string;
  _placeholder: BaseStyle;
  _disabled: StickyDisabled;
}

interface StickyDisabled {
  cursor: string;
  backgroundColor: string;
  color: string;
}

interface BaseStyle {
  color: string;
}

interface InputSizes {
  small: Medium;
  medium: Medium;
  large: FluffyLarge;
}

interface FluffyLarge {
  height: number;
  lineHeight: string;
}

interface Medium {
  height: number;
}

interface Link {
  baseStyle: LinkBaseStyle;
  appearances: SizesClass;
  sizes: SizesClass;
}

interface LinkBaseStyle {
  borderRadius: string;
  transition: string;
  textDecoration: string;
  _hover: SizesClass;
  _active: SizesClass;
  _focus: SizesClass;
}

interface List {
  baseStyle: SizesClass;
  appearances: SizesClass;
  sizes: SizesClass;
}

interface MenuItem {
  baseStyle: MenuItemBaseStyle;
  appearances: MenuItemAppearances;
}

interface MenuItemAppearances {
  default: IndigoDefault;
}

interface IndigoDefault {
  backgroundColor: Color;
  '&:before': Before;
  _hover: None;
  _focus: None;
  _active: CurrentClass;
  _current: CurrentClass;
}

interface Before {
  content: string;
  position: string;
  left: number;
  top: number;
  bottom: number;
  width: number;
  borderRadius: string;
  backgroundColor: string;
  transition: string;
  transformOrigin: string;
  transform: string;
}

interface CurrentClass {
  backgroundColor: string;
  '&:before': ActiveBefore;
}

interface ActiveBefore {
  transform: string;
}

interface MenuItemBaseStyle {
  outline: string;
  textDecoration: string;
  display: string;
  position: string;
  paddingX: number;
  _isSelectable: IsSelectable;
  _disabled: FluffyDisabled;
}

interface IsSelectable {
  cursor: string;
}

interface Option {
  baseStyle: OptionBaseStyle;
}

interface OptionBaseStyle {
  outline: string;
  textDecoration: string;
  display: string;
  position: string;
  backgroundColor: Color;
  _before: Before;
  _isSelectable: IsSelectable;
  _hover: None;
  _focus: None;
  _active: None;
  _selected: Selected;
  _disabled: IndigoDisabled;
}

interface IndigoDisabled {
  opacity: number;
  pointerEvents: string;
  cursor: string;
}

interface Selected {
  backgroundColor: string;
  ' span': BaseStyle;
  '&:before': ActiveBefore;
}

interface ParagraphClass {
  baseStyle: ParagraphBaseStyle;
  appearances: SizesClass;
  sizes: { [key: string]: Paragraph };
}

interface ParagraphBaseStyle {
  marginTop: number;
  marginBottom: number;
}

interface Select {
  baseStyle: SelectBaseStyle;
  appearances: SelectAppearances;
  sizes: SelectSizes;
}

interface SelectAppearances {
  default: IndecentDefault;
}

interface IndecentDefault {
  backgroundColor: Color;
  color: string;
  _disabled: IndecentDisabled;
  _hover: DisabledClass;
  _focus: BaseStyleFocus;
  _active: None;
}

interface IndecentDisabled {
  cursor: string;
  color: string;
  borderColor: string;
}

interface SelectBaseStyle {
  fontFamily: FontFamily;
  borderRadius: string;
  border: number;
}

interface SelectSizes {
  small: TentacledLarge;
  medium: TentacledLarge;
  large: TentacledLarge;
}

interface TentacledLarge {
  height: number;
  fontSize: string;
  lineHeight: string;
}

interface Spinner {
  baseStyle: BaseStyle;
  appearances: SizesClass;
  sizes: SpinnerSizes;
}

interface SpinnerSizes {
  small: StickyLarge;
  medium: StickyLarge;
  large: StickyLarge;
}

interface StickyLarge {
  width: number;
  height: number;
}

interface Switch {
  baseStyle: SizesClass;
  appearances: TentacledAppearances;
  sizes: SizesClass;
}

interface TentacledAppearances {
  default: HilariousDefault;
}

interface HilariousDefault {
  _base: Blue;
  _disabled: HilariousDisabled;
  _hover: None;
  _focus: SizesClass;
  _active: None;
  _checked: Blue;
  _checkedHover: Blue;
  _checkedActive: Blue;
  _checkedDisabled: SizesClass;
}

interface Blue {
  color: string;
  backgroundColor: string;
}

interface HilariousDisabled {
  cursor: string;
  opacity: number;
}

interface Tab {
  baseStyle: TabBaseStyle;
  appearances: TabAppearances;
}

interface TabAppearances {
  primary: AppearancesPrimary;
  secondary: Secondary;
}

interface AppearancesPrimary {
  color: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  position: string;
  ':not(:last-child)': SizesClass;
  _before: PrimaryBefore;
  _hover: BaseStyle;
  _current: Current;
  _focus: PrimaryFocus;
  _disabled: PrimaryDisabled;
}

interface PrimaryBefore {
  content: string;
  position: string;
  bottom: number;
  right: number;
  height: string;
  borderRadius: string;
  backgroundColor: string;
  width: string;
  transition: string;
  transform: string;
  transformOrigin: string;
}

interface Current {
  color: string;
  '&:before': ActiveBefore;
  '&:focus': BaseStyle;
}

interface PrimaryDisabled {
  pointerEvents: string;
  cursor: string;
  color: string;
  '&:before'?: None;
  '&[aria-current="page"], &[aria-selected="true"]'?: None;
}

interface PrimaryFocus {
  boxShadow: string;
  color: string;
}

interface Secondary {
  paddingX: string;
  paddingY: string;
  borderRadius: string;
  color: string;
  ':not(:last-child)': SizesClass;
  _hover: Blue;
  _active: None;
  _current: Blue;
  _focus: BaseStyleFocus;
  _disabled: PrimaryDisabled;
}

interface TabBaseStyle {
  fontFamily: FontFamily;
  fontWeight: number;
}

interface Table {
  baseStyle: TableBaseStyle;
  appearances: SizesClass;
  sizes: SizesClass;
}

interface TableBaseStyle {
  borderRadius: string;
  border: string;
}

interface TableCell {
  baseStyle: TableCellBaseStyle;
  appearances: StickyAppearances;
  sizes: SizesClass;
}

interface StickyAppearances {
  default: AmbitiousDefault;
}

interface AmbitiousDefault {
  _focus: FluffyFocus;
}

interface FluffyFocus {
  outline: string;
  background: string;
}

interface TableCellBaseStyle {
  paddingX: number;
}

interface TableHead {
  baseStyle: TableHeadBaseStyle;
  appearances: SizesClass;
  sizes: SizesClass;
}

interface TableHeadBaseStyle {
  borderBottom: string;
  background: string;
  height: string;
  fontSize: string;
  fontWeight: FontWeightEnum;
  lineHeight: string;
  letterSpacing: string;
  fontFamily: FontFamily;
  color: string;
  textTransform: string;
}

interface TableRow {
  baseStyle: TableRowBaseStyle;
  appearances: TableRowAppearances;
}

interface TableRowAppearances {
  default: CunningDefault;
}

interface CunningDefault {
  _hover: SizesClass;
  _focus: SizesClass;
  _active: SizesClass;
  _current: SizesClass;
}

interface TableRowBaseStyle {
  outline: string;
  textDecoration: string;
  height: number;
  _isSelectable: IsSelectable;
}

interface TagInput {
  baseStyle: TagInputBaseStyle;
  appearances: IndigoAppearances;
  sizes: SizesClass;
}

interface IndigoAppearances {
  default: MagentaDefault;
}

interface MagentaDefault {
  _focused: Focused;
  _disabled: AmbitiousDisabled;
}

interface AmbitiousDisabled {
  cursor: string;
  backgroundColor: string;
}

interface Focused {
  outline: string;
  zIndex: string;
  transition: string;
  boxShadow: string;
}

interface TagInputBaseStyle {
  paddingY: string;
  backgroundColor: Color;
  borderRadius: string;
}

interface TextClass {
  baseStyle: SizesClass;
  appearances: SizesClass;
  sizes: { [key: string]: Paragraph };
}

interface TextDropdownButton {
  baseStyle: TextDropdownButtonBaseStyle;
  appearances: SizesClass;
  sizes: TextDropdownButtonSizes;
}

interface TextDropdownButtonBaseStyle {
  fontFamily: FontFamily;
  backgroundColor: string;
  borderRadius: string;
  paddingX: number;
  marginX: number;
  paddingY: number;
  marginY: number;
  color: string;
  _disabled: FluffyDisabled;
  _focus: BaseStyleFocus;
}

interface TextDropdownButtonSizes {
  small: IndigoLarge;
  medium: IndigoLarge;
  large: IndigoLarge;
}

interface IndigoLarge {
  fontSize: string;
  lineHeight: string;
}

interface Tooltip {
  baseStyle: TooltipBaseStyle;
  appearances: IndecentAppearances;
  sizes: SizesClass;
}

interface IndecentAppearances {
  card: None;
  default: Blue;
}

interface TooltipBaseStyle {
  paddingY: number;
  paddingX: number;
  maxWidth: number;
  borderRadius: string;
  elevation: string;
}

interface Fills {
  neutral: Blue;
  blue: Blue;
  red: Blue;
  orange: Blue;
  yellow: Blue;
  green: Blue;
  teal: Blue;
  purple: Blue;
}

interface FontFamilies {
  display: string;
  ui: string;
  mono: string;
}

interface FontWeights {
  light: number;
  normal: number;
  semibold: number;
  bold: number;
}

interface Intents {
  info: Danger;
  success: Danger;
  warning: Danger;
  danger: Danger;
}

interface Danger {
  background: string;
  border: string;
  text: string;
  icon: string;
}

interface LetterSpacings {
  tightest: string;
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
}

interface Tokens {
  colors: Colors;
  fontFamilies: FontFamilies;
  text: { [key: string]: Paragraph };
  paragraph: { [key: string]: Paragraph };
  overlayBackgroundColor: string;
  codeBackgroundColor: string;
  codeBorderColor: string;
  fills: Fills;
  selectedOptionColor: string;
  borderRadius: number;
  primary: TokensPrimary;
  intents: Intents;
  states: States;
}

interface TokensPrimary {
  base: string;
  hover: string;
  active: string;
  disabled: string;
}

interface States {
  default: Dark;
  muted: Dark;
  dark: Dark;
  disabled: Dark;
  selected: Dark;
}

interface Dark {
  icon: string;
}

interface ZIndices {
  focused: number;
  stack: number;
  positioner: number;
  overlay: number;
  toaster: number;
}
