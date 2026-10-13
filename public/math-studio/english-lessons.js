/* English counterparts of all original chapter concepts, examples and checks. */
'use strict';
(()=>{
  const I=MathStudioI18n;
  I.register({
    '初一':'Year 7','初二':'Year 8','高一':'Year 10','上冊':'Volume 1','下冊':'Volume 2','核心課題':'Core topics','大綱補充':'Syllabus supplements','附加數學':'Additional mathematics',
    '數與代數':'Number and algebra','圖形與空間':'Shape and space','數據處理':'Data handling','集合與邏輯':'Sets and logic','函數':'Functions','向量與幾何':'Vectors and geometry',
    '由有理數出發，建立代數與幾何的基礎。':'Start with rational numbers and build foundations in algebra and geometry.',
    '從幾何論證到函數，連起數與形的關係。':'Connect number and shape through geometric reasoning and functions.',
    '以函數為主線，走向抽象思考與數學應用。':'Use functions to develop abstract reasoning and mathematical applications.',
    '七年級上、下冊':'Year 7, volumes 1 and 2','八年級上、下冊':'Year 8, volumes 1 and 2','A 版必修第一冊＋大綱補充':'Edition A, compulsory volume 1, with syllabus supplements',
    '大綱 PDF 第 13–19 頁':'Syllabus PDF pages 13–19','大綱 PDF 第 20–25 頁':'Syllabus PDF pages 20–25','文組 PDF 第 31–38 頁；理組第 47–55 頁':'Arts PDF pages 31–38; science pages 47–55',
    'S = 底 × 高':'S = base × height','平均數 = 總和 ÷ 個數':'Mean = sum ÷ count','頻率 = 頻數 ÷ 總數':'Relative frequency = frequency ÷ total','V錐 = Sh/3':'V(cone) = Sh/3'
  });
  const chapter=(id,title,concepts,example,steps,pitfall,questions)=>{const source=lessons.find(x=>x.id===id);if(!source)throw Error('Unknown English lesson '+id);if(concepts.length!==source.concepts.length||steps.length!==source.steps.length||questions.length!==source.questions.length)throw Error('Incomplete English lesson '+id);const translated={title,concepts,example,steps,pitfall,questions:questions.map((q,index)=>({prompt:q[0],options:q[1]||source.questions[index].options,explanation:q[2]}))};I.registerTree(source,translated);};
  chapter('rational','Rational numbers',[
    'Integers and fractions are rational numbers. Positive and negative numbers can describe quantities in opposite directions; zero is neither positive nor negative.',
    'A number line has an origin, a positive direction, and a unit length. Numbers further right are larger. Opposite numbers are reflections in the origin.',
    'Absolute value is distance from the origin, so |a| ≥ 0. Of two negative numbers, the one with greater absolute value is smaller.'
  ],'Order −3, −1, and 2. Find the opposite and absolute value of −3.',[
    'On the number line, −3 is left of −1, and −1 is left of 2.','Therefore −3 < −1 < 2.','The opposite of −3 is 3. Its distance from the origin is 3 units, so |−3| = 3.'
  ],'An opposite number can be negative; an absolute value is always at least 0.',[
    ['What is |−7|?',null,'Absolute value is distance: −7 is 7 units from the origin.'],['Which number is smallest?',null,'−5 is furthest left. Among negative numbers, a greater absolute value means a smaller number.']]);
  chapter('operations','Operations with rational numbers',[
    'When adding numbers of the same sign, retain that sign. For different signs, subtract the smaller absolute value from the larger and use the sign of the number with larger absolute value. Subtracting a number means adding its opposite.',
    'For multiplication and division, determine the sign before calculating the magnitude. The divisor cannot be zero. Powers precede multiplication and division, which precede addition and subtraction. Operations of equal priority proceed left to right.',
    'Scientific notation has the form a × 10ⁿ, where 1 ≤ |a| < 10. Round approximations to the requested place.'
  ],'Calculate −2² + 3 × (−4 + 6).',['First evaluate the brackets: −4 + 6 = 2.','−2² = −(2²) = −4, and 3 × 2 = 6.','Combine: −4 + 6 = 2.'],'−2² = −4, whereas (−2)² = 4. Brackets determine the base.',[
    ['What is (−3)²?',null,'The base is the whole number −3, so (−3) × (−3) = 9.'],['Write 450 000 in scientific notation.',null,'The leading factor must be at least 1 and less than 10; move the decimal point five places left.']]);
  chapter('expressions','Algebraic expressions',[
    'Letters represent numbers and describe a whole class of numerical relationships. Multiplication signs are usually omitted between a number and a letter: 2 × x becomes 2x.',
    'Distinguish a quantity per item from a total quantity. Use brackets when an operation acts on a whole expression.',
    'Evaluate an expression by substituting the given values and following the order of operations. Use brackets when substituting a negative number.'
  ],'Notebooks cost 8 dollars each, with a single packaging fee of 3 dollars. Find the cost of x notebooks, then the cost when x = 5.',[
    'The notebooks cost 8x dollars; the packaging fee is fixed at 3 dollars.','The total cost is C = 8x + 3.','For x = 5, C = 8 × 5 + 3 = 43 dollars.'
  ],'An extra 3 dollars in total is different from an extra 3 dollars for each notebook.',[
    ['When x = −2, what is 3x + 1?',null,'3 × (−2) + 1 = −6 + 1 = −5.'],['Write “twice x, then subtract 5”.',null,'Twice the number is 2x; subtracting 5 gives 2x − 5.']]);
  chapter('polynomial-add','Adding and subtracting polynomials',[
    'A monomial is a product of numbers and letters; a polynomial is a sum of monomials. The degree of a monomial is the sum of its variable exponents.',
    'Like terms have the same variables with the same corresponding exponents. Combine their coefficients while leaving the variable part unchanged.',
    'A minus sign before brackets changes the sign of every term inside. Remove brackets, identify like terms, then combine them.'
  ],'Simplify 3x − 2(x − 4) + 5.',['Distribute −2: 3x − 2x + 8 + 5.','Combine the x terms: 3x − 2x = x.','Combine constants: 8 + 5 = 13, giving x + 13.'],'x² and x are unlike terms; they cannot combine to give 2x².',[
    ['What is the degree of 2a²b?',null,'The exponent of a is 2 and that of b is 1, so the degree is 3.'],['Simplify 5x − (2x − 1).',null,'Removing brackets gives 5x − 2x + 1 = 3x + 1.']]);
  chapter('linear-equation','Linear equations in one variable',[
    'An equation is an equality containing an unknown. A linear equation in one variable contains one unknown and has highest degree 1 after simplification.',
    'Adding or subtracting the same number on both sides, or multiplying or dividing both sides by the same nonzero number, preserves equality. Moving a term is shorthand for performing the same operation on both sides.',
    'For a word problem, define the unknown and identify an equality before solving. Substitute the answer into the original situation and check units and reasonableness.'
  ],'Solve 3(x − 2) = 2x + 5.',['Expand: 3x − 6 = 2x + 5.','Subtract 2x from both sides, then add 6: x = 11.','Check: 3 × 9 = 27 and 22 + 5 = 27, so the solution is correct.'],'When clearing denominators, multiply every term. Transposition follows the properties of equality.',[
    ['Solve 2x + 7 = 15.',null,'Subtract 7 to obtain 2x = 8, then divide by 2: x = 4.'],['Solve 5(x − 1) = 20.',null,'Divide both sides by 5: x − 1 = 4, so x = 5.']]);
  chapter('geometry','Introduction to geometric figures',[
    'A segment has two endpoints; a ray has one endpoint; a line extends indefinitely in both directions. Two distinct points determine a line, and the segment between them is the shortest path.',
    'Complementary angles sum to 90°; supplementary angles sum to 180°. An angle bisector divides an angle into two equal angles.',
    'Syllabus supplement: prism volume V = Sh; pyramid volume V = Sh/3. Cylinder total surface area is 2πr² + 2πrh, cone total surface area is πr² + πrℓ, where ℓ is slant height. Sphere surface area is 4πr² and volume is 4πr³/3.'
  ],'An angle is 38°. Find its complement and supplement.',['A complement and the original angle sum to 90°.','Complement = 90° − 38° = 52°.','Supplement = 180° − 38° = 142°.'],'Cone volume uses perpendicular height h; lateral surface area uses slant height ℓ. Do not interchange them.',[
    ['Find the supplement of 70°.',null,'Supplementary angles sum to 180°, giving 110°.'],['A cylinder has base area 12 and height 5. Find its volume.',null,'Volume = base area × height = 12 × 5 = 60.']]);
  chapter('parallel','Intersecting and parallel lines',[
    'Vertically opposite angles are equal; adjacent angles on a straight line sum to 180°. Distance from a point to a line is the perpendicular length.',
    'For parallel lines cut by a transversal, corresponding and alternate interior angles are equal, while co-interior angles are supplementary. Conversely, these angle relationships can establish parallelism.',
    'A proof states the givens, the conclusion, and a reason for each step. Translation preserves lengths and angles; corresponding points move the same distance in the same direction.'
  ],'Two parallel lines are cut by a transversal. One interior angle is 65°. Find its co-interior angle.',[
    'Identify the two angles on the same side of the transversal and between the parallel lines.','Co-interior angles between parallel lines are supplementary.','Required angle = 180° − 65° = 115°.'
  ],'Equal corresponding angles require the parallel condition; apparent parallelism in a drawing is not a justification.',[
    ['Alternate interior angles lie between two parallel lines. One is 48°. Find the other.',null,'Alternate interior angles between parallel lines are equal.'],['Which property changes under translation?',['Segment length','Angle size','Position','Area'],'Translation changes position while preserving size and shape.']]);
  chapter('real','Real numbers',[
    'If x² = a, x is a square root of a. A positive number has two opposite square roots; √a denotes the nonnegative principal square root.',
    'A cube root satisfies x³ = a. Every real number has one real cube root; for example, ∛(−8) = −2.',
    'Real numbers include rational and irrational numbers. Irrational numbers have nonterminating, nonrepeating decimal expansions, such as √2 and π. Real numbers correspond one-to-one with points on the number line.'
  ],'Find the square roots and the principal square root of 49.',['7² = 49 and (−7)² = 49.','Therefore the square roots of 49 are 7 and −7.','The principal square root is nonnegative, so √49 = 7.'],'√49 is not ±7; the two square roots of 49 are ±7.',[
    ['Evaluate √64.',null,'The radical symbol denotes the principal square root, so take the nonnegative value 8.'],['Which number is irrational?',null,'√2 has a nonterminating, nonrepeating decimal expansion. The other values are ratios of integers.']]);
  chapter('coordinates','Cartesian coordinates',[
    'Coordinates are ordered pairs (x, y): horizontal first, vertical second. The signs in quadrants I–IV are (+,+), (−,+), (−,−), and (+,−).',
    'Points on the x-axis satisfy y = 0; points on the y-axis satisfy x = 0. Points on the axes are not in a quadrant.',
    'Translation a units right adds a to x; translation b units up adds b to y. Coordinates turn geometric movement into arithmetic.'
  ],'Translate P(−2, 3) five units right, then four units down. Find its new coordinates.',[
    'Horizontal coordinate: −2 + 5 = 3.','Vertical coordinate: 3 − 4 = −1.','The new point is (3, −1), in quadrant IV.'
  ],'Coordinates are ordered: (2, 3) and (3, 2) represent different points.',[
    ['Which quadrant contains (−3, −2)?',['Quadrant I','Quadrant II','Quadrant III','Quadrant IV'],'Both coordinates are negative, so the point is in quadrant III.'],['Where is (4, 0)?',['x-axis','y-axis','Quadrant I','Quadrant IV'],'Its vertical coordinate is 0, so it lies on the x-axis.']]);
  chapter('systems','Simultaneous linear equations',[
    'A solution of a system must satisfy every equation. One linear equation in two variables usually has many solutions, but two equations may have just one common solution.',
    'Substitution expresses one unknown in terms of another. Elimination first creates cancelling coefficients, reducing two variables to one.',
    'The same elimination principle applies to three variables: eliminate the same unknown to form two equations in two variables, then solve and substitute back.'
  ],'Solve x + y = 7 and 2x − y = 2.',['Add the equations to eliminate y: 3x = 9.','Thus x = 3. Substitute into x + y = 7 to get y = 4.','Check: 3 + 4 = 7 and 2 × 3 − 4 = 2. The solution is (3, 4).'],'After finding one unknown, substitute back to find the other and check both original equations.',[
    ['Given x + y = 9 and x − y = 3, find x.',null,'Adding gives 2x = 12, so x = 6.'],['Find y in the preceding system.',null,'Substitute x = 6 into x + y = 9: y = 3.']]);
  chapter('inequality','Inequalities and systems of inequalities',[
    'The solution set contains every number satisfying an inequality. On the number line, it is often a region rather than a single point.',
    'Adding or subtracting the same number preserves the inequality direction. Multiplying or dividing by a positive number preserves it; multiplying or dividing by a negative number reverses it.',
    'A system requires all inequalities simultaneously, so intersect their solution sets. A filled endpoint is included; an open endpoint is excluded.'
  ],'Solve 3 − 2x ≥ 7.',['Subtract 3: −2x ≥ 4.','Divide by −2 and reverse the sign: x ≤ −2.','The solution set includes −2 and extends left.'],'Only multiplication or division by a negative number reverses the sign; transposition alone does not.',[
    ['Solve −3x > 6.',null,'Dividing by −3 reverses the inequality sign.'],['Find the common solution set of x > 1 and x ≤ 4.',['x > 4','x ≤ 1','1 < x ≤ 4','No solution'],'Both conditions must hold, so take their intersection.']]);
  chapter('data-collection','Collecting, organising and describing data',[
    'A census studies the whole population; a sample survey studies part of it. A representative sample must not consist only of convenient or preferred respondents.',
    'Bar charts compare category counts, line graphs show change over time, and pie charts show proportions of a whole.',
    'Relative frequency equals frequency divided by the total. A pie-sector angle equals the proportion × 360°. Establish the total before choosing a chart.'
  ],'Ten of 40 pupils walk to school. Find the angle of the walking sector in a pie chart.',['The walking proportion is 10/40 = 1/4 = 25%.','The whole circle represents 360°.','Walking-sector angle = 360° × 1/4 = 90°.'],'A truncated vertical axis can exaggerate visual differences; read the scale.',[
    ['Which display best shows changes in daily temperature?',['Line graph','Pie chart','Geometric construction','Set diagram'],'A line graph shows change over time.'],['Fifteen of 50 people choose A. Find the relative frequency.',null,'15 ÷ 50 = 0.3 = 30%.']]);
  chapter('triangles','Triangles',[
    'The sum of any two sides of a triangle exceeds the third side. For three positive lengths, it suffices to check that the two shorter lengths sum to more than the longest.',
    'Interior angles sum to 180°. An exterior angle equals the sum of the two nonadjacent interior angles.',
    'A median joins a vertex to the opposite midpoint; an altitude is perpendicular to the line containing the opposite side; an angle bisector halves a vertex angle.'
  ],'Two interior angles of a triangle are 48° and 67°. Find the third angle and its adjacent exterior angle.',[
    'Third interior angle = 180° − 48° − 67° = 65°.','Adjacent exterior angle = 180° − 65° = 115°.','Alternatively, use the exterior-angle theorem: 48° + 67° = 115°.'
  ],'An altitude need not lie inside a triangle. An obtuse triangle has two altitudes outside it.',[
    ['Which lengths form a triangle?',null,'3 + 4 > 5. In the other cases, the two shorter lengths do not sum to more than the longest.'],['Two interior angles are 35° and 75°. Find the third.',null,'180° − 35° − 75° = 70°.']]);
  chapter('congruence','Congruent triangles',[
    'Congruent triangles fit exactly onto one another, with equal corresponding sides and angles. Match corresponding vertices when writing a congruence statement.',
    'Use SSS, SAS, ASA, or AAS. Right triangles also admit HL: equal hypotenuses and one corresponding leg. AAA guarantees shape only.',
    'A point on an angle bisector is equidistant from the two sides. The converse applies to points inside the angle. These distances are perpendicular lengths.'
  ],'Given AB = DE, AC = DF, and ∠BAC = ∠EDF, prove △ABC ≅ △DEF.',[
    '∠BAC is the included angle between AB and AC; ∠EDF is between DE and DF.','Two pairs of corresponding sides and their included angles are equal.','Thus △ABC ≅ △DEF by SAS, and consequently BC = EF.'
  ],'SSA does not generally establish congruence. SAS requires the equal angle to lie between the two given sides.',[
    ['Which criterion generally does not establish congruence?',null,'Triangles with equal angles can have different sizes, so AAA is insufficient.'],['How do the distances from a point on an angle bisector to the two sides compare?',['Always equal','Always supplementary','Always zero','Cannot be compared'],'The angle-bisector property makes the two perpendicular distances equal.']]);
  chapter('symmetry','Reflection symmetry',[
    'The symmetry axis perpendicularly bisects segments joining corresponding points. A point on a segment’s perpendicular bisector is equidistant from its endpoints.',
    'Reflection in the x-axis changes the sign of y; reflection in the y-axis changes the sign of x.',
    'In an isosceles triangle, the base angles are equal and the apex angle bisector, base altitude, and base median coincide. Every angle of an equilateral triangle is 60°.'
  ],'An isosceles triangle has apex angle 40°. Find the two base angles.',[
    'The base angles are equal; let each be x.','The angle sum gives 40° + 2x = 180°.','Thus 2x = 140°, so each base angle is 70°.'
  ],'The coincident bisector, altitude, and median refer specifically to the apex and base of an isosceles triangle.',[
    ['Reflect (2, −3) in the y-axis.',null,'Reflection in the y-axis changes only the sign of the horizontal coordinate.'],['An isosceles triangle has base angle 50°. Find its apex angle.',null,'Apex angle = 180° − 2 × 50° = 80°.']]);
  chapter('multiply','Multiplying polynomials',[
    'When multiplying powers with the same base, add exponents; when raising a power to a power, multiply exponents. Distribute every term when multiplying polynomials.',
    'Difference of squares: (a + b)(a − b) = a² − b². Perfect squares: (a ± b)² = a² ± 2ab + b².',
    'Syllabus supplement: a³ + b³ = (a + b)(a² − ab + b²); a³ − b³ = (a − b)(a² + ab + b²).'
  ],'Expand (2x − 3)².',['Use the perfect-square formula with a = 2x and b = 3.','(2x)² − 2(2x)(3) + 3².','Simplify to 4x² − 12x + 9.'],'(a + b)² is not a² + b²; retain the middle term 2ab.',[
    ['Simplify x³ × x⁴.',null,'Same-base multiplication adds exponents: 3 + 4 = 7.'],['Expand (x + 5)(x − 5).',null,'The difference-of-squares formula gives x² − 5².']]);
  chapter('factor','Factorisation',[
    'Factorisation writes a polynomial as a product of polynomials and reverses expansion. Check for a common factor first.',
    'Then look for a difference of squares, a perfect square, or a sum or difference of cubes. Continue until each factor is fully factorised.',
    'For x² + px + q, find m and n with m + n = p and mn = q to obtain (x + m)(x + n). Grouping first brings together terms with a shared factor.'
  ],'Factorise x² + 5x + 6.',['Find two numbers with product 6 and sum 5.','The numbers 2 and 3 satisfy both conditions.','Therefore x² + 5x + 6 = (x + 2)(x + 3); check by expanding.'],'The final form of a factorisation is a product, not a sum.',[
    ['Factorise 2x² − 8.',null,'Factor out 2, then use the difference of squares on x² − 4.'],['Factorise x² − 6x + 9.',null,'9 = 3² and −6x = −2 × 3 × x, so this is a perfect square.']]);
  chapter('fractions','Algebraic fractions',[
    'An algebraic fraction has a variable in its denominator, which must be nonzero. Its value is zero only when its numerator is zero and its denominator is not.',
    'Cancel common factors, never individual terms in a sum or difference. Use a common denominator for addition or subtraction. Also, a⁻ⁿ = 1/aⁿ for a ≠ 0.',
    'Before solving a fractional equation, state the restrictions. Multiply by the lowest common denominator, then check and reject values that make an original denominator zero.'
  ],'Solve 2/(x − 1) = 1.',['Restriction: x ≠ 1.','Multiply both sides by x − 1: 2 = x − 1, giving x = 3.','Check: 2/(3 − 1) = 1 and the denominator is nonzero, so 3 is a solution.'],'Clearing denominators does not remove restrictions. Identical simplified formulas can have different domains.',[
    ['Simplify (x² − 1)/(x − 1).',['x − 1, x ≠ 1','x + 1, x ≠ 1','x + 1, all real x','x² + 1'],'The numerator is (x − 1)(x + 1). Cancellation retains x ≠ 1.'],['Evaluate 2⁻³.',null,'A negative integer exponent denotes a reciprocal: 2⁻³ = 1/2³ = 1/8.']]);
  chapter('radicals','Square-root expressions',[
    'Over the real numbers, √a requires a ≥ 0. A principal square root is nonnegative, so √(a²) = |a|.',
    'For a, b ≥ 0, √a√b = √(ab). Division also requires the denominator’s radicand to be positive.',
    'Simplify radicals before combining like radicals. Rationalise a radical denominator using a suitable radical or conjugate.'
  ],'Simplify √12 + √27.',['√12 = √(4 × 3) = 2√3.','√27 = √(9 × 3) = 3√3.','Combine like radicals: 2√3 + 3√3 = 5√3.'],'√(a + b) is generally not √a + √b.',[
    ['Evaluate √((−5)²).',null,'√(a²) = |a|, so the result is 5.'],['Simplify √8 + √2.',null,'√8 = 2√2, giving 3√2 in total.']]);
  chapter('pythagoras','Pythagoras’ theorem',[
    'In a right triangle with legs a and b and hypotenuse c, a² + b² = c². The hypotenuse is the longest side, opposite the right angle.',
    'Converse: if a² + b² = c², with c the longest side, the triangle is right-angled.',
    'Draw a right triangle for problems involving ladders, diagonals, or distances, and identify the correct sides before substituting.'
  ],'A 5 m ladder stands with its foot 3 m from a wall. How high is its top?',['The ladder is the hypotenuse; height h and ground distance 3 are the legs.','h² + 3² = 5², so h² = 25 − 9 = 16.','Height is positive: h = 4 m.'],'Apply Pythagoras’ theorem directly only to a right triangle. Identify the hypotenuse first.',[
    ['The legs are 6 and 8. Find the hypotenuse.',null,'c = √(6² + 8²) = √100 = 10.'],['Do lengths 5, 12, and 13 form a right triangle?',['Yes','No','Insufficient information','Only an isosceles triangle'],'5² + 12² = 25 + 144 = 169 = 13².']]);
  chapter('quadrilaterals','Quadrilaterals',[
    'The interior-angle sum of an n-gon is (n − 2) × 180°. In a parallelogram, opposite sides and angles are equal and diagonals bisect one another.',
    'A rectangle has equal diagonals; a rhombus has perpendicular diagonals. A square has the properties of both.',
    'Use definitions or established theorems for classification. A trapezium’s midsegment is parallel to its bases and has half their total length; its area is (upper base + lower base) × height/2.'
  ],'A trapezium has bases 6 cm and 10 cm and height 4 cm. Find its midsegment and area.',['Midsegment = (6 + 10)/2 = 8 cm.','Area = (6 + 10) × 4/2.','Thus the area is 32 cm², also equal to midsegment × height.'],'Equal diagonals alone do not establish a rectangle; additional conditions, such as being a parallelogram, are needed.',[
    ['Find the interior-angle sum of a hexagon.',null,'(6 − 2) × 180° = 720°.'],['What must the diagonals of a parallelogram do?',['Be equal','Be perpendicular','Bisect one another','Bisect every interior angle'],'The diagonals of every parallelogram bisect one another.']]);
  chapter('function-intro','Functions',[
    'If every x in a specified domain has exactly one corresponding y, then y is a function of x. Different x values may share a y value.',
    'Represent functions with tables, formulas, or graphs. In a real situation, the input domain must satisfy both mathematical and practical restrictions.',
    'Read axes and units before interpreting trends, intercepts, and special points. A vertical line with several y values for the same x does not represent y as a function of x.'
  ],'An empty 60 L tank fills at 3 L per minute. Express volume V in terms of time t.',[
    'Volume increases by 3 L each minute, so V = 3t.','Filling takes 60/3 = 20 minutes.','Therefore 0 ≤ t ≤ 20, corresponding to 0 ≤ V ≤ 60.'
  ],'A formula alone omits the contextual domain; the model must change after the tank fills.',[
    ['For y = x², find y when x = −3.',null,'y = (−3)² = 9.'],['For a function, how many y values correspond to each x?',['Two','Exactly one','All different','All positive'],'Each x must have one y, but different x values may have the same y.']]);
  chapter('linear-function','Linear functions',[
    'A linear function y = kx + b has k ≠ 0 and a straight-line graph. When b = 0, it is a direct-proportion function.',
    'If k > 0, the graph rises as x increases; if k < 0, it falls. The y-coordinate of the y-intercept is b.',
    'Two distinct points determine a line. Its x-intercept solves kx + b = 0, and the region above the x-axis corresponds to kx + b > 0.'
  ],'Find the linear function through (0, 3) and (2, 7).',['The point (0, 3) gives b = 3.','Substitute (2, 7): 7 = 2k + 3, so k = 2.','The function is y = 2x + 3.'],'When k = 0, the function is constant and is excluded from this lesson’s definition of a linear function.',[
    ['Find the y-intercept of y = −2x + 4.',null,'Set x = 0 to obtain y = 4.'],['Find the zero of y = 3x − 6.',null,'Set y = 0: 3x − 6 = 0, so x = 2.']]);
  chapter('statistics','Analysing data',[
    'The mean uses every value and is sensitive to outliers. The median is the central ordered value, and the mode is the most frequent value. A weighted mean accounts for the weights.',
    'Variance describes spread through squared distances from the mean. To describe the whole dataset here, divide by n: s² = Σ(xᵢ − x̄)²/n.',
    'Quartiles split ordered data into four parts. This page takes the median of each half, excluding the overall median for odd-sized datasets. Textbooks and software may use other conventions; align them before comparing.'
  ],'Find the mean, median, and variance of 2, 4, 4, 6.',['Mean = (2 + 4 + 4 + 6)/4 = 4; median = (4 + 4)/2 = 4.','Squared deviations are 4, 0, 0, 4, with sum 8.','Variance = 8/4 = 2; mode = 4.'],'Sample variance for statistical inference may divide by n − 1; do not mix definitions.',[
    ['Find the median of 1, 2, 3, 4, 100.',null,'The ordered central value is the third number, 3.'],['What happens to variance if 5 is added to every value?',['Increases by 5','Multiplies by 5','Unchanged','Becomes 0'],'The mean also increases by 5, leaving all deviations unchanged.']]);
  chapter('sets','Sets',[
    'Set membership is definite, elements are distinct, and their order is irrelevant. a ∈ A means a belongs to A; A ⊆ B means every element of A belongs to B.',
    'A ∩ B contains elements in both sets; A ∪ B contains elements in at least one. A complement requires a specified universal set U.',
    'For finite sets, |A ∪ B| = |A| + |B| − |A ∩ B| prevents double-counting shared elements.'
  ],'Given A = {1, 2, 3} and B = {2, 3, 4}, find their intersection and union.',[
    'The shared elements are 2 and 3, so A ∩ B = {2, 3}.','Combine the sets without repetitions: A ∪ B = {1, 2, 3, 4}.','Check the count: 3 + 3 − 2 = 4.'
  ],'∈ relates an element to a set; ⊆ relates two sets. Do not interchange them.',[
    ['A = {1, 3, 5} and B = {3, 4}. Find A ∩ B.',null,'The only shared element is 3.'],['U = {1, 2, 3, 4} and A = {2, 4}. Find the complement of A.',null,'Choose the elements of U that are not in A.']]);
  chapter('logic','Logical language',[
    'If p ⇒ q, p is sufficient for q and q is necessary for p. If both directions hold, each is necessary and sufficient for the other.',
    'One counterexample refutes a universal claim. The negation of “every x satisfies P” is “there exists an x that does not satisfy P”.',
    'Check forward and reverse implications separately. A relationship does not by itself establish equivalence.'
  ],'What kind of condition is “x = 2” for “x² = 4”?',[
    'If x = 2, then x² = 4; the forward implication holds.','If x² = 4, x can be 2 or −2, so x = 2 need not hold.','Thus x = 2 is sufficient but not necessary for x² = 4.'
  ],'A true implication does not guarantee its converse. Here x = −2 tests the converse.',[
    ['What kind of condition is x > 2 for x > 0?',['Sufficient, not necessary','Necessary, not sufficient','Necessary and sufficient','Neither'],'x > 2 implies x > 0, but x > 0 does not imply x > 2.'],['Find a counterexample to “x² > 0 for every real x”.',null,'0² = 0, which is not strictly positive.']]);
  chapter('quadratic-inequality','Quadratic inequalities',[
    'Rearrange to compare ax² + bx + c with zero. The discriminant Δ = b² − 4ac determines the number of real roots.',
    'If a > 0 and there are distinct roots x₁ < x₂, the quadratic is positive outside the roots and negative between them. For a < 0, these signs reverse.',
    'Divide the number line at the roots, then determine each region’s sign. Whether roots are included depends on whether equality is allowed.'
  ],'Solve x² − 4x + 3 ≤ 0.',[
    'Factorise: (x − 1)(x − 3) ≤ 0, with roots 1 and 3.','The leading coefficient is positive, so the quadratic is negative between the roots.','The roots give zero and are included. The solution is [1, 3].'
  ],'The shortcut “positive outside, negative inside” directly applies only with positive leading coefficient and two distinct real roots.',[
    ['Solve (x − 2)(x − 5) < 0.',['x < 2 or x > 5','2 < x < 5','2 ≤ x ≤ 5','All real numbers'],'Between the roots, the factors have opposite signs and the product is negative. Exclude the endpoints.'],['Solve x² + 1 > 0.',['No solution','x > 1','x < −1','All real numbers'],'For every real x, x² ≥ 0, so x² + 1 ≥ 1 > 0.']]);
  chapter('polynomial-division','Polynomial division and the remainder theorem',[
    'Dividend = divisor × quotient + remainder, where the remainder has lower degree than the divisor.',
    'The remainder when f(x) is divided by x − a is f(a). If f(a) = 0, x − a is a factor of f(x).',
    'Synthetic division streamlines division by x − a. Insert zero coefficients for missing terms. Determine unknown coefficients by special-value substitution or coefficient comparison.'
  ],'Find the remainder when f(x) = x³ − 2x² + 3 is divided by x − 2.',[
    'The divisor x − 2 corresponds to a = 2.','By the remainder theorem, r = f(2).','f(2) = 8 − 8 + 3 = 3, so the remainder is 3.'
  ],'For division by x + 2, substitute −2 rather than 2.',[
    ['For f(x) = x² − 5x + 6, which expression is a factor?',null,'f(2) = 4 − 10 + 6 = 0, so x − 2 is a factor.'],['Find the remainder when x² + 1 is divided by x + 1.',null,'Substitute x = −1: (−1)² + 1 = 2.']]);
  chapter('function-properties','Function concepts and properties',[
    'A function is determined by its domain and mapping. Its domain must satisfy every restriction, including nonzero denominators and nonnegative radicands for even roots.',
    'A function is increasing on an interval if x₁ < x₂ always implies f(x₁) < f(x₂). Even functions satisfy f(−x) = f(x); odd functions satisfy f(−x) = −f(x). Both require domains symmetric about zero.',
    'For f(g(x)), x must be in the domain of g and g(x) in that of f. A piecewise function selects a rule according to x. Check for extraneous roots after squaring an irrational equation.'
  ],'Find the domain of f(x) = √(x − 1)/(x − 3).',[
    'The radical requires x − 1 ≥ 0, so x ≥ 1.','The denominator requires x ≠ 3.','Together these give [1, 3) ∪ (3, +∞).'
  ],'Check domain symmetry before classifying a function as odd or even; a similar-looking formula is insufficient.',[
    ['Classify f(x) = x³ for x ∈ ℝ.',['Even','Odd','Both odd and even','Neither'],'f(−x) = −x³ = −f(x), and its domain is symmetric about zero.'],['For f(x) = 2x + 1 and g(x) = x², find f(g(2)).',null,'First g(2) = 4, then f(4) = 2 × 4 + 1 = 9.']]);
  chapter('exponential','Exponential and logarithmic functions',[
    'For y = aˣ, require a > 0 and a ≠ 1. The domain is ℝ and range is (0, +∞). The function increases for a > 1 and decreases for 0 < a < 1.',
    'logₐy = x means aˣ = y. The logarithm’s argument y must be positive. The logarithm of a product is a sum; the logarithm of a quotient is a difference.',
    'Exponential and logarithmic functions are inverses, with graphs reflected in y = x. State argument restrictions before solving logarithmic equations and check solutions afterwards.'
  ],'Solve log₂(x − 1) = 3.',[
    'The argument requires x − 1 > 0, so x > 1.','Rewrite in exponential form: x − 1 = 2³ = 8.','Thus x = 9, which satisfies x > 1 and solves the original equation.'
  ],'logₐ(u + v) is not logₐu + logₐv. The sum-of-logs rule corresponds to multiplication.',[
    ['Evaluate log₃27.',null,'Since 3³ = 27, log₃27 = 3.'],['How does y = (1/2)ˣ change as x increases?',['Increases','Decreases','Constant','First increases, then decreases'],'With a base between zero and one, the exponential function decreases throughout ℝ.']]);
  chapter('trigonometry','Trigonometric functions',[
    'Convert degrees and radians using 180° = π rad. The unit-circle point at angle θ is (cos θ, sin θ); tan θ = sin θ/cos θ for cos θ ≠ 0.',
    'Sine and cosine have fundamental period 2π; tangent has period π. Reduction identities connect angles to familiar positions, for example sin(π − θ) = sin θ.',
    'Addition formulas: sin(α + β) = sin α cos β + cos α sin β; cos(α + β) = cos α cos β − sin α sin β. For y = A sin(ωx + φ), amplitude is |A| and period is 2π/|ω|, assuming A, ω ≠ 0.'
  ],'Find the amplitude and period of y = 3 sin(2x).',[
    'Compare with A sin(ωx + φ): A = 3 and ω = 2.','Amplitude = |A| = 3, so the range is [−3, 3].','Period T = 2π/|2| = π.'
  ],'sin(α + β) is not sin α + sin β. Do not mix degrees and radians.',[
    ['Convert 150° to radians.',null,'150 × π/180 = 5π/6.'],['Evaluate sin(π/6).',null,'π/6 = 30°, and sin 30° = 1/2.']]);
  chapter('vectors','Plane vectors',[
    'Vectors have magnitude and direction. Add them with the triangle or parallelogram rule, or component by component in coordinates.',
    'For a = (a₁, a₂) and b = (b₁, b₂), a · b = a₁b₁ + a₂b₂. Two nonzero vectors are perpendicular exactly when their dot product is zero.',
    'Two noncollinear vectors form a basis of the plane. Distance is √((x₂ − x₁)² + (y₂ − y₁)²), and midpoint coordinates are the averages of endpoint coordinates.'
  ],'Determine whether a = (2, 1) and b = (1, −2) are perpendicular.',[
    'a · b = 2 × 1 + 1 × (−2).','Hence a · b = 0.','Both vectors are nonzero, so a ⟂ b.'
  ],'Scalar multiplication produces a vector; a dot product produces a number. Distinguish them.',[
    ['Calculate (1, 2) + (3, −1).',null,'Add corresponding coordinates: 1 + 3 = 4 and 2 − 1 = 1.'],['Find the magnitude of (3, 4).',null,'Magnitude = √(3² + 4²) = 5.']]);
  chapter('solve-triangles','Solving triangles',[
    'Sides a, b, c oppose angles A, B, C. The sine rule a/sin A = b/sin B = c/sin C is useful when a corresponding angle-side pair is known.',
    'The cosine rule c² = a² + b² − 2ab cos C handles two sides and their included angle, or finding an angle from three sides.',
    'Triangle area is S = ab sin C/2. Two sides and an opposite angle may admit two solutions; check angle ranges.'
  ],'Given a = 5, b = 7, and included angle C = 60°, find c.',[
    'Use the cosine rule: c² = 5² + 7² − 2 × 5 × 7 cos 60°.','Since cos 60° = 1/2, c² = 25 + 49 − 35 = 39.','Side length is positive, so c = √39.'
  ],'The angle in the cosine rule is the included angle between the two given sides.',[
    ['For a = 4, b = 6, C = 90°, find the area.',null,'S = 4 × 6 × sin 90°/2 = 12.'],['What does the cosine rule become when C = 90°?',null,'cos 90° = 0 removes the cosine term, giving Pythagoras’ theorem.']]);
  chapter('solid','Introduction to solid geometry',[
    'Prisms, pyramids, frustums, and spheres have different structures. Oblique drawings use a slanted direction and reduced scale to represent space; apparent lengths are not necessarily true lengths.',
    'Prism volume V = Sh; pyramid volume V = Sh/3; frustum volume V = h(S₁ + S₂ + √(S₁S₂))/3. Here h is always perpendicular height.',
    'Sphere surface area is 4πr² and volume is 4πr³/3. Surface area adds exterior face areas and has different units from volume.'
  ],'A cone has radius 3 and height 4. Find its volume and total surface area.',[
    'Base area S = π × 3² = 9π; volume V = 9π × 4/3 = 12π.','Slant height ℓ = √(3² + 4²) = 5.','Lateral area πrℓ = 15π. Add the base area 9π to obtain total surface area 24π.'
  ],'Surface area uses square units; volume uses cubic units.',[
    ['A cone and cylinder share the same base and height. Find their volume ratio.',null,'The cone has one third the cylinder’s volume.'],['Find the surface area of a sphere of radius 2.',null,'4πr² = 4π × 2² = 16π.']]);
  chapter('variation','Variation',[
    'Direct variation means y = kx; inverse variation means y = k/x for x ≠ 0. The constant k is fixed.',
    'Joint variation with x and z can be written y = kxz. Partial variation often combines a fixed and a variable part, as in y = a + bx.',
    'Translate the verbal relationship into a formula, determine the constant from given data, then apply new conditions.'
  ],'y varies directly as x². If y = 12 when x = 2, find y when x = 3.',[
    'Write y = kx².','Substitute: 12 = k × 4, so k = 3.','When x = 3, y = 3 × 9 = 27.'
  ],'Direct variation with x² means y = kx², not y = (kx)².',[
    ['If y varies inversely as x and x doubles, what happens to y?',['Doubles','Quadruples','Halves','Unchanged'],'In y = k/x, doubling the denominator halves the result.'],['For y = kx with x = 4 and y = 10, find k.',null,'k = y/x = 10/4 = 2.5.']]);
  chapter('polynomial-gcd','Common polynomial factors and multiples',[
    'Fully factorise each polynomial. A greatest common factor uses shared factors at their lowest powers; a least common multiple uses every factor at its highest power.',
    'To remove ambiguity from nonzero constant multiples, choose a monic greatest common factor.',
    'The Euclidean algorithm repeatedly uses the fact that the dividend and divisor have the same common factors as the divisor and remainder, reducing degrees until the remainder is zero.'
  ],'Find the monic GCD and LCM of x² − 1 and x² − 2x + 1.',[
    'Factorise: x² − 1 = (x − 1)(x + 1), and x² − 2x + 1 = (x − 1)².','The common factor at its lowest power is x − 1, giving the GCD.','Using every factor at its highest power gives LCM = (x − 1)²(x + 1).'
  ],'“Greatest” concerns divisibility and degree, not the numerical value at a chosen x.',[
    ['Find the monic GCD of x² and x³.',null,'Use the lowest shared power of x: x².'],['Find the monic LCM of x(x + 1) and x(x − 1).',null,'Use each distinct factor at its highest power; x is needed only once.']]);
  chapter('partial-fractions','Partial fractions',[
    'Partial fractions express a rational expression as a sum of simpler fractions. If the numerator degree is at least the denominator degree, divide polynomials first.',
    'For distinct linear factors, write A/(x − a) + B/(x − b). Clear denominators, then compare coefficients or substitute special values to determine constants.',
    'For repeated factors, include every power: (x − a)² requires A/(x − a) + B/(x − a)². Retain the original restrictions.'
  ],'Decompose 1/[x(x + 1)] into partial fractions.',[
    'Set 1/[x(x + 1)] = A/x + B/(x + 1), with x ≠ 0, −1.','Compare numerators: 1 = A(x + 1) + Bx. Setting x = 0 gives A = 1; setting x = −1 gives B = −1.','Thus the expression is 1/x − 1/(x + 1), with unchanged restrictions.'
  ],'Special values are substituted into the polynomial identity after clearing denominators, not into the original fractions at forbidden values.',[
    ['Find the coefficient of 1/x in the partial fractions of 1/[x(x + 2)].',null,'Use 1 = A(x + 2) + Bx. At x = 0, A = 1/2.'],['What happens to the restrictions on x after decomposition?',['All disappear','Only positive values remain','Original restrictions remain','All integers become valid'],'Algebraic rewriting cannot make an originally zero denominator valid.']]);
  chapter('space-relations','Parallelism and perpendicularity in space',[
    'Two spatial lines may intersect, be parallel, or be skew. Skew lines neither intersect nor are parallel and do not share a plane.',
    'If a line outside a plane is parallel to a line within it, the outside line is parallel to the plane.',
    'A line perpendicular to two intersecting lines in a plane is perpendicular to the plane. The intersection condition is essential; two parallel lines do not suffice.'
  ],'In cube ABCD–A′B′C′D′, explain why AA′ is perpendicular to plane ABCD.',[
    'Adjacent cube edges are perpendicular, so AA′ ⟂ AB and AA′ ⟂ AD.','AB and AD lie in plane ABCD and intersect at A.','By the line-plane perpendicularity criterion, AA′ ⟂ plane ABCD.'
  ],'Nonintersecting spatial lines need not be parallel; they may be skew.',[
    ['Must two nonintersecting lines in space be parallel?',['Yes','No; they may be skew','Only if equally long','Only if perpendicular'],'Skew lines do not intersect and are not parallel.'],['To establish perpendicularity to a plane, a line must be perpendicular to which lines in it?',['Any one line','Two parallel lines','Two intersecting lines','Just one edge'],'Perpendicularity to two intersecting lines establishes perpendicularity to the plane.']]);
  const sourceTerms={
    '七上':'Year 7, volume 1','七下':'Year 7, volume 2','八上':'Year 8, volume 1','八下':'Year 8, volume 2',
    'A 版第一冊':'Edition A, volume 1','第 ':'Chapter ',' 章':'','文組大綱 PDF':'Arts syllabus PDF','大綱 PDF':'Syllabus PDF','文組大綱':'Arts syllabus','理組':'science',
    '大綱補充；A 版第一冊未另設此專章':'Syllabus supplement; no separate chapter in the supplied Edition A volume 1',
    '未附相應教材；依大綱編寫原創入門':'Corresponding textbook not supplied; original introduction based on the syllabus',
    '附加數學；未附相應教材':'Additional mathematics; corresponding textbook not supplied',
    '大綱補充：文組 PDF':'Syllabus supplement: arts PDF','文組 PDF':'Arts PDF',
    '；冊別依附件教材校正':'; volume checked against the supplied textbook','；另列立體表面積、體積補充':'; solid surface area and volume supplements listed separately',
    '；含三元一次方程組':'; includes linear systems in three variables','；含立方和差補充':'; includes sums and differences of cubes',
    '；含十字相乘與分組':'; includes cross-multiplication and grouping factorisation','（亦稱畢氏定理）':' (Pythagoras’ theorem)',
    '；含梯形及中位線補充':'; includes trapezium and midsegment supplements','；依教材名稱「一次函數」':'; follows the textbook title “Linear functions”',
    '；量詞參照理組':'; quantifiers follow the science syllabus','。第二章其餘內容主要列高二':'. Other Chapter 2 content is mainly assigned to Year 11',
    '。大綱與附件部分小節編號不同':'. Some section numbers differ between the syllabus and supplied textbook',
    '：高一第一段':': Year 10, first block','：高一第二段':': Year 10, second block','、':', ','；':'; '
  };
  for(const lesson of lessons)for(const field of ['source','scope']){let value=lesson[field];for(const [zh,en] of Object.entries(sourceTerms).sort((a,b)=>b[0].length-a[0].length))value=value.split(zh).join(en);I.register([[lesson[field],value]]);}
})();
