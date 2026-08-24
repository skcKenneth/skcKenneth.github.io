#!/usr/bin/env python3
"""Generate Kenneth Cheng's deterministic composite-attractor identity mark.

The mark is not an illustrative approximation.  It combines a numerically
integrated Halvorsen flow, a compact Aizawa flow, and a Clifford iterated map.
The Halvorsen orbit remains the primary silhouette; the other systems add a
toroidal core and a restrained point-cloud field.  SVG output needs only the
Python standard library.  Raster and ICO outputs additionally require Pillow.
"""

from __future__ import annotations

import math
from pathlib import Path
from typing import Iterable, Sequence


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
IMAGES = PUBLIC / "images"

VIEWBOX = 1024
HALVORSEN_A = 1.4
DT = 0.005
TRANSIENT_STEPS = 12_000
KEPT_STEPS = 72_000
SAMPLE_STRIDE = 3
INITIAL_STATE = (1.0, 0.0, 0.0)

AIZAWA_DT = 0.005
AIZAWA_TRANSIENT_STEPS = 10_000
AIZAWA_KEPT_STEPS = 48_000
AIZAWA_SAMPLE_STRIDE = 3
AIZAWA_INITIAL_STATE = (0.1, 0.0, 0.0)
AIZAWA_PARAMETERS = (0.95, 0.7, 0.6, 3.5, 0.25, 0.1)

CLIFFORD_TRANSIENT_STEPS = 2_000
CLIFFORD_KEPT_STEPS = 24_000
CLIFFORD_SAMPLE_STRIDE = 6
CLIFFORD_INITIAL_STATE = (0.1, 0.1)
CLIFFORD_PARAMETERS = (-1.4, 1.6, 1.0, 0.7)

BACKGROUND = "#0d1b26"
BACKGROUND_INNER = "#17333d"
INK = "#050e14"
PAPER = "#edf5f2"
PALETTE = (
    "#32b58d",
    "#72d7c0",
    "#d9f5ed",
    "#62c5dc",
    "#628bd4",
    "#9a8ee6",
)
GRID = "#88b9c5"
SECTION_FILL = "#d9f5ed"
SECTION_STROKE = "#32b58d"
AIZAWA_PALETTE = ("#d9f5ed", "#62c5dc", "#9a8ee6", "#72d7c0")
CLIFFORD_PALETTE = ("#32b58d", "#62c5dc", "#628bd4")


def derivative(state: Sequence[float]) -> tuple[float, float, float]:
    """Return the Halvorsen vector field at ``state``."""

    x, y, z = state
    return (
        -HALVORSEN_A * x - 4.0 * y - 4.0 * z - y * y,
        -HALVORSEN_A * y - 4.0 * z - 4.0 * x - z * z,
        -HALVORSEN_A * z - 4.0 * x - 4.0 * y - x * x,
    )


def rk4_step(state: Sequence[float]) -> tuple[float, float, float]:
    """Advance the system by one fixed fourth-order Runge--Kutta step."""

    k1 = derivative(state)
    k2 = derivative(tuple(state[i] + 0.5 * DT * k1[i] for i in range(3)))
    k3 = derivative(tuple(state[i] + 0.5 * DT * k2[i] for i in range(3)))
    k4 = derivative(tuple(state[i] + DT * k3[i] for i in range(3)))
    return tuple(
        state[i] + DT * (k1[i] + 2.0 * k2[i] + 2.0 * k3[i] + k4[i]) / 6.0
        for i in range(3)
    )


def integrate() -> list[tuple[float, float, float]]:
    """Integrate a deterministic orbit after discarding the transient."""

    state = INITIAL_STATE
    points: list[tuple[float, float, float]] = []
    total = TRANSIENT_STEPS + KEPT_STEPS
    for step in range(total):
        state = rk4_step(state)
        if not all(math.isfinite(value) for value in state):
            raise RuntimeError(f"Halvorsen integration diverged at step {step}")
        if step >= TRANSIENT_STEPS and (step - TRANSIENT_STEPS) % SAMPLE_STRIDE == 0:
            points.append(state)
    return points


def aizawa_derivative(state: Sequence[float]) -> tuple[float, float, float]:
    """Return the standard six-parameter Aizawa vector field."""

    x, y, z = state
    a, b, c, d, e, f = AIZAWA_PARAMETERS
    radius_squared = x * x + y * y
    return (
        (z - b) * x - d * y,
        d * x + (z - b) * y,
        c
        + a * z
        - z * z * z / 3.0
        - radius_squared * (1.0 + e * z)
        + f * z * x * x * x,
    )


def aizawa_rk4_step(state: Sequence[float]) -> tuple[float, float, float]:
    """Advance the Aizawa system with a fixed fourth-order RK step."""

    k1 = aizawa_derivative(state)
    k2 = aizawa_derivative(
        tuple(state[i] + 0.5 * AIZAWA_DT * k1[i] for i in range(3))
    )
    k3 = aizawa_derivative(
        tuple(state[i] + 0.5 * AIZAWA_DT * k2[i] for i in range(3))
    )
    k4 = aizawa_derivative(
        tuple(state[i] + AIZAWA_DT * k3[i] for i in range(3))
    )
    return tuple(
        state[i]
        + AIZAWA_DT * (k1[i] + 2.0 * k2[i] + 2.0 * k3[i] + k4[i]) / 6.0
        for i in range(3)
    )


def integrate_aizawa() -> list[tuple[float, float, float]]:
    """Integrate a deterministic Aizawa orbit after its transient."""

    state = AIZAWA_INITIAL_STATE
    points: list[tuple[float, float, float]] = []
    total = AIZAWA_TRANSIENT_STEPS + AIZAWA_KEPT_STEPS
    for step in range(total):
        state = aizawa_rk4_step(state)
        if not all(math.isfinite(value) for value in state):
            raise RuntimeError(f"Aizawa integration diverged at step {step}")
        if (
            step >= AIZAWA_TRANSIENT_STEPS
            and (step - AIZAWA_TRANSIENT_STEPS) % AIZAWA_SAMPLE_STRIDE == 0
        ):
            points.append(state)
    return points


def iterate_clifford() -> list[tuple[float, float]]:
    """Iterate a deterministic Clifford map and retain its settled orbit."""

    a, b, c, d = CLIFFORD_PARAMETERS
    x, y = CLIFFORD_INITIAL_STATE
    points: list[tuple[float, float]] = []
    total = CLIFFORD_TRANSIENT_STEPS + CLIFFORD_KEPT_STEPS
    for step in range(total):
        x, y = math.sin(a * y) + c * math.cos(a * x), math.sin(
            b * x
        ) + d * math.cos(b * y)
        if not (math.isfinite(x) and math.isfinite(y)):
            raise RuntimeError(f"Clifford iteration diverged at step {step}")
        if (
            step >= CLIFFORD_TRANSIENT_STEPS
            and (step - CLIFFORD_TRANSIENT_STEPS) % CLIFFORD_SAMPLE_STRIDE == 0
        ):
            points.append((x, y))
    return points


def project(points: Iterable[Sequence[float]]) -> list[tuple[float, float]]:
    """Project along (1,1,1), revealing the attractor's threefold symmetry."""

    inv_sqrt_2 = 1.0 / math.sqrt(2.0)
    inv_sqrt_6 = 1.0 / math.sqrt(6.0)
    raw = [
        (
            (x - y) * inv_sqrt_2,
            (x + y - 2.0 * z) * inv_sqrt_6,
        )
        for x, y, z in points
    ]

    min_u = min(p[0] for p in raw)
    max_u = max(p[0] for p in raw)
    min_v = min(p[1] for p in raw)
    max_v = max(p[1] for p in raw)
    centre_u = 0.5 * (min_u + max_u)
    centre_v = 0.5 * (min_v + max_v)
    # A small in-plane rotation puts one lobe upright and improves recognition
    # at favicon scale without changing the underlying projection.
    theta = math.radians(-8.0)
    cos_t, sin_t = math.cos(theta), math.sin(theta)
    rotated = []
    for u, v in raw:
        u0, v0 = u - centre_u, v - centre_v
        u1 = cos_t * u0 - sin_t * v0
        v1 = sin_t * u0 + cos_t * v0
        rotated.append((u1, v1))

    # Fit by Euclidean radius, not by the bounding-box width.  This keeps every
    # orbit segment inside the circular mark even along diagonal directions.
    radius = max(math.hypot(u, v) for u, v in rotated)
    scale = 408.0 / radius
    result = [
        (VIEWBOX / 2 + scale * u, VIEWBOX / 2 - scale * v)
        for u, v in rotated
    ]
    return result


def project_aizawa(
    points: Iterable[Sequence[float]],
) -> list[tuple[float, float]]:
    """Use an oblique projection to reveal the Aizawa toroidal funnel."""

    raw = [
        (
            0.84 * x - 0.54 * y,
            0.34 * x + 0.53 * y + 0.78 * z,
        )
        for x, y, z in points
    ]
    centre_u = 0.5 * (min(u for u, _ in raw) + max(u for u, _ in raw))
    centre_v = 0.5 * (min(v for _, v in raw) + max(v for _, v in raw))
    centred = [(u - centre_u, v - centre_v) for u, v in raw]
    radius = max(math.hypot(u, v) for u, v in centred)
    scale = 126.0 / radius
    return [
        (VIEWBOX / 2 + scale * u, VIEWBOX / 2 - scale * v)
        for u, v in centred
    ]


def project_clifford(
    points: Iterable[Sequence[float]],
) -> list[tuple[float, float]]:
    """Rotate and fit the Clifford point cloud inside the circular field."""

    raw_points = [(x, y) for x, y in points]
    centre_x = 0.5 * (
        min(x for x, _ in raw_points) + max(x for x, _ in raw_points)
    )
    centre_y = 0.5 * (
        min(y for _, y in raw_points) + max(y for _, y in raw_points)
    )
    theta = math.radians(17.0)
    cos_t, sin_t = math.cos(theta), math.sin(theta)
    rotated = []
    for x, y in raw_points:
        x0, y0 = x - centre_x, y - centre_y
        rotated.append((cos_t * x0 - sin_t * y0, sin_t * x0 + cos_t * y0))
    radius = max(math.hypot(x, y) for x, y in rotated)
    scale = 372.0 / radius
    return [
        (VIEWBOX / 2 + scale * x, VIEWBOX / 2 - scale * y)
        for x, y in rotated
    ]


def path_data(points: Sequence[tuple[float, float]]) -> str:
    head, *tail = points
    commands = [f"M {head[0]:.2f} {head[1]:.2f}"]
    commands.extend(f"L {x:.2f} {y:.2f}" for x, y in tail)
    return " ".join(commands)


def coloured_chunks(points: Sequence[tuple[float, float]], count: int = 18):
    chunk = math.ceil(len(points) / count)
    for index in range(count):
        start = max(0, index * chunk - (1 if index else 0))
        end = min(len(points), (index + 1) * chunk)
        if end - start > 1:
            yield index, points[start:end]


def poincare_section(
    orbit: Sequence[tuple[float, float, float]],
    projected: Sequence[tuple[float, float]],
    maximum: int = 54,
) -> list[tuple[float, float]]:
    """Interpolate upward crossings of the ``z = 0`` Poincare plane."""

    crossings: list[tuple[float, float]] = []
    for index, (left, right) in enumerate(zip(orbit, orbit[1:])):
        if left[2] < 0.0 <= right[2]:
            denominator = right[2] - left[2]
            fraction = -left[2] / denominator if denominator else 0.0
            x0, y0 = projected[index]
            x1, y1 = projected[index + 1]
            crossings.append(
                (x0 + fraction * (x1 - x0), y0 + fraction * (y1 - y0))
            )
    if len(crossings) <= maximum:
        return crossings
    return [
        crossings[round(index * (len(crossings) - 1) / (maximum - 1))]
        for index in range(maximum)
    ]


def lobe_nodes(
    points: Sequence[tuple[float, float]],
) -> list[tuple[float, float]]:
    """Locate one stable outer marker for each angular lobe of the orbit."""

    sectors: list[list[tuple[float, float, float]]] = [[], [], []]
    for x, y in points:
        dx, dy = x - VIEWBOX / 2, y - VIEWBOX / 2
        angle = (math.atan2(dy, dx) + 2.0 * math.pi) % (2.0 * math.pi)
        sector = min(2, int(angle / (2.0 * math.pi / 3.0)))
        sectors[sector].append((math.hypot(dx, dy), x, y))

    nodes = []
    for sector in sectors:
        outer = sorted(sector, reverse=True)[: max(12, len(sector) // 80)]
        nodes.append(
            (
                sum(item[1] for item in outer) / len(outer),
                sum(item[2] for item in outer) / len(outer),
            )
        )
    return nodes


def symmetry_grid_svg() -> str:
    """Return a restrained threefold phase-space scaffold."""

    rings = "".join(
        f'<circle cx="512" cy="512" r="{radius}" fill="none" stroke="{GRID}" '
        'stroke-width="2.8" opacity="0.34" stroke-dasharray="6 12"/>'
        for radius in (142, 274, 406)
    )
    axes = []
    for angle_degrees in (-8, 52, 112):
        angle = math.radians(angle_degrees)
        dx, dy = 430 * math.cos(angle), 430 * math.sin(angle)
        axes.append(
            f'<path d="M {512-dx:.2f} {512-dy:.2f} L {512+dx:.2f} {512+dy:.2f}" '
            f'fill="none" stroke="{GRID}" stroke-width="2.2" opacity="0.28"/>'
        )
    return rings + "".join(axes)


def clifford_cloud_svg(
    points: Sequence[tuple[float, float]], opacity: float = 0.10
) -> str:
    """Render the Clifford orbit as three lightweight SVG point paths."""

    paths = []
    palette_size = len(CLIFFORD_PALETTE)
    for colour_index, colour in enumerate(CLIFFORD_PALETTE):
        commands = " ".join(
            f"M {x:.2f} {y:.2f} h 0.01"
            for point_index, (x, y) in enumerate(points)
            if point_index % palette_size == colour_index
        )
        paths.append(
            f'<path d="{commands}" fill="none" stroke="{colour}" '
            f'stroke-width="3.2" stroke-linecap="round" opacity="{opacity:.2f}"/>'
        )
    return "".join(paths)


def svg_document(
    points: Sequence[tuple[float, float]],
    section: Sequence[tuple[float, float]],
    nodes: Sequence[tuple[float, float]],
    aizawa: Sequence[tuple[float, float]],
    clifford: Sequence[tuple[float, float]],
    *,
    compact: bool = False,
) -> str:
    """Build one accessible SVG document from the three computed systems."""

    full_path = path_data(points)
    halvorsen_shadow_width = 26 if compact else 14
    halvorsen_width = 12 if compact else 5.5
    segments = []
    for index, chunk in coloured_chunks(points):
        colour = PALETTE[index % len(PALETTE)]
        segments.append(
            f'<path d="{path_data(chunk)}" fill="none" stroke="{colour}" '
            f'stroke-width="{halvorsen_width}" stroke-linecap="round" stroke-linejoin="round" '
            'opacity="0.88"/>'
        )
    aizawa_shadow_width = 15 if compact else 8
    aizawa_width = 7 if compact else 3.2
    aizawa_segments = []
    for index, chunk in coloured_chunks(aizawa, count=12):
        colour = AIZAWA_PALETTE[index % len(AIZAWA_PALETTE)]
        aizawa_segments.append(
            f'<path d="{path_data(chunk)}" fill="none" stroke="{colour}" '
            f'stroke-width="{aizawa_width}" stroke-linecap="round" '
            'stroke-linejoin="round" opacity="0.70"/>'
        )
    section_marks = "".join(
        f'<circle cx="{x:.2f}" cy="{y:.2f}" r="6.1" fill="{SECTION_FILL}" '
        f'stroke="{SECTION_STROKE}" stroke-width="2" opacity="0.86"/>'
        for x, y in section
    )
    node_marks = "".join(
        f'<circle cx="{x:.2f}" cy="{y:.2f}" r="13" fill="{BACKGROUND}" '
        f'stroke="{SECTION_FILL}" stroke-width="4" opacity="0.96"/>'
        f'<circle cx="{x:.2f}" cy="{y:.2f}" r="3.5" fill="{SECTION_STROKE}"/>'
        for x, y in nodes
    )
    clifford_marks = "" if compact else clifford_cloud_svg(clifford)
    visible_section = "" if compact else section_marks

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEWBOX} {VIEWBOX}" role="img" aria-labelledby="title desc">
  <title id="title">Composite computational attractor identity mark</title>
  <desc id="desc">A deterministic composition of Halvorsen and Aizawa strange-attractor trajectories with a Clifford-map point field, generated by numerical integration and iteration.</desc>
  <defs>
    <radialGradient id="field" cx="44%" cy="40%" r="66%">
      <stop offset="0" stop-color="{BACKGROUND_INNER}"/>
      <stop offset="1" stop-color="{BACKGROUND}"/>
    </radialGradient>
    <clipPath id="disc"><circle cx="512" cy="512" r="486"/></clipPath>
  </defs>
  <circle cx="512" cy="512" r="496" fill="{PAPER}"/>
  <circle cx="512" cy="512" r="484" fill="url(#field)"/>
  <g clip-path="url(#disc)">
    <g aria-hidden="true">{clifford_marks}</g>
    {symmetry_grid_svg()}
    <path d="{path_data(aizawa)}" fill="none" stroke="{INK}" stroke-width="{aizawa_shadow_width}" stroke-linecap="round" stroke-linejoin="round" opacity="0.62"/>
    {''.join(aizawa_segments)}
    <path d="{full_path}" fill="none" stroke="{INK}" stroke-width="{halvorsen_shadow_width}" stroke-linecap="round" stroke-linejoin="round" opacity="0.72"/>
    {''.join(segments)}
    <g aria-hidden="true">{visible_section}</g>
    <g aria-hidden="true">{node_marks}</g>
  </g>
  <circle cx="512" cy="512" r="484" fill="none" stroke="{PAPER}" stroke-width="7" opacity="0.92"/>
</svg>
'''


def write_svg(
    points: Sequence[tuple[float, float]],
    section: Sequence[tuple[float, float]],
    nodes: Sequence[tuple[float, float]],
    aizawa: Sequence[tuple[float, float]],
    clifford: Sequence[tuple[float, float]],
) -> Path:
    """Write an accessible master mark and a lighter favicon variant."""

    # The numerical orbit is retained at full density for the raster master.
    # SVGs are sampled because tens of thousands of collinear commands add
    # download cost without visible benefit at identity-mark scale.
    svg = svg_document(
        points[::8],
        section,
        nodes,
        aizawa[::12],
        clifford[::4],
    )
    target = IMAGES / "kenneth-computational-attractor-mark.svg"
    target.write_text(svg, encoding="utf-8", newline="\n")
    (PUBLIC / "favicon.svg").write_text(
        svg_document(
            points[::56],
            section[::2],
            nodes,
            aizawa[::72],
            (),
            compact=True,
        ),
        encoding="utf-8",
        newline="\n",
    )
    return target


def hex_rgba(colour: str, alpha: int = 255) -> tuple[int, int, int, int]:
    colour = colour.lstrip("#")
    return tuple(int(colour[i : i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def render_raster(
    points: Sequence[tuple[float, float]],
    section: Sequence[tuple[float, float]],
    nodes: Sequence[tuple[float, float]],
    aizawa: Sequence[tuple[float, float]],
    clifford: Sequence[tuple[float, float]],
    size: int,
    *,
    opaque_background: bool = False,
):
    """Render a high-quality PNG with Pillow.

    Raster derivatives intentionally use solid rings and a flat field so the
    phase-space scaffold survives small icon sizes; the master SVG keeps the
    subtler dashed rings and radial field used on the About page.
    """

    try:
        from PIL import Image, ImageChops, ImageDraw
    except ImportError as exc:  # pragma: no cover - environment-dependent
        raise RuntimeError("Pillow is required for PNG and ICO generation") from exc

    supersample = 4 if size <= 512 else 2
    canvas = size * supersample
    scale = canvas / VIEWBOX
    background = hex_rgba(PAPER) if opaque_background else (0, 0, 0, 0)
    image = Image.new("RGBA", (canvas, canvas), background)
    draw = ImageDraw.Draw(image, "RGBA")

    def box(radius: float) -> tuple[float, float, float, float]:
        centre = canvas / 2
        r = radius * scale
        return centre - r, centre - r, centre + r, centre + r

    draw.ellipse(box(496), fill=hex_rgba(PAPER))
    draw.ellipse(box(484), fill=hex_rgba(BACKGROUND))

    clip_mask = Image.new("L", (canvas, canvas), 0)
    ImageDraw.Draw(clip_mask).ellipse(box(484), fill=255)

    # The discrete map is a quiet density texture, not a competing foreground
    # motif.  It is deliberately omitted from the 32 px favicon derivative.
    if size > 32:
        cloud_layer = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
        cloud_draw = ImageDraw.Draw(cloud_layer, "RGBA")
        cloud_alpha = 27 if size >= 256 else 18
        point_radius = max(1.0, 1.45 * scale)
        for index, (x, y) in enumerate(clifford):
            cx, cy = x * scale, y * scale
            cloud_draw.ellipse(
                (
                    cx - point_radius,
                    cy - point_radius,
                    cx + point_radius,
                    cy + point_radius,
                ),
                fill=hex_rgba(
                    CLIFFORD_PALETTE[index % len(CLIFFORD_PALETTE)],
                    cloud_alpha,
                ),
            )
        cloud_layer.putalpha(
            ImageChops.multiply(cloud_layer.getchannel("A"), clip_mask)
        )
        image.alpha_composite(cloud_layer)

    grid_width = max(1, round(2.5 * scale))
    for radius in (142, 274, 406):
        draw.ellipse(
            box(radius),
            outline=hex_rgba(GRID, 76),
            width=grid_width,
        )
    centre = canvas / 2
    for angle_degrees in (-8, 52, 112):
        angle = math.radians(angle_degrees)
        dx = 430 * scale * math.cos(angle)
        dy = 430 * scale * math.sin(angle)
        draw.line(
            (centre - dx, centre - dy, centre + dx, centre + dy),
            fill=hex_rgba(GRID, 64),
            width=grid_width,
        )

    mapped = [(round(x * scale), round(y * scale)) for x, y in points]
    mapped_aizawa = [(round(x * scale), round(y * scale)) for x, y in aizawa]
    orbit_layer = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    orbit_draw = ImageDraw.Draw(orbit_layer, "RGBA")
    if size <= 32:
        aizawa_shadow_width = max(1, round(1.5 * supersample))
        aizawa_width = max(1, round(0.9 * supersample))
        halvorsen_shadow_width = max(1, round(1.65 * supersample))
        halvorsen_width = max(1, round(1.25 * supersample))
    else:
        aizawa_shadow_width = max(1, round(8 * scale))
        aizawa_width = max(1, round(3.2 * scale))
        halvorsen_shadow_width = max(1, round(14 * scale))
        halvorsen_width = max(1, round(5.5 * scale))

    orbit_draw.line(
        mapped_aizawa,
        fill=hex_rgba(INK, 158),
        width=aizawa_shadow_width,
        joint="curve",
    )
    for index, chunk in coloured_chunks(mapped_aizawa, count=12):
        orbit_draw.line(
            chunk,
            fill=hex_rgba(
                AIZAWA_PALETTE[index % len(AIZAWA_PALETTE)],
                179,
            ),
            width=aizawa_width,
            joint="curve",
        )
    orbit_draw.line(
        mapped,
        fill=hex_rgba(INK, 184),
        width=halvorsen_shadow_width,
        joint="curve",
    )
    for index, chunk in coloured_chunks(mapped):
        orbit_draw.line(
            chunk,
            fill=hex_rgba(PALETTE[index % len(PALETTE)], 224),
            width=halvorsen_width,
            joint="curve",
        )
    orbit_layer.putalpha(ImageChops.multiply(orbit_layer.getchannel("A"), clip_mask))
    image.alpha_composite(orbit_layer)
    marker_radius = max(1.0, 6.1 * scale)
    marker_width = max(1, round(2 * scale))
    visible_section = () if size <= 32 else section
    for x, y in visible_section:
        cx, cy = x * scale, y * scale
        draw.ellipse(
            (cx - marker_radius, cy - marker_radius, cx + marker_radius, cy + marker_radius),
            fill=hex_rgba(SECTION_FILL, 198),
            outline=hex_rgba(SECTION_STROKE, 220),
            width=marker_width,
        )
    node_radius = max(1.0, 13 * scale)
    node_width = max(1, round(4 * scale))
    for x, y in nodes:
        cx, cy = x * scale, y * scale
        draw.ellipse(
            (cx - node_radius, cy - node_radius, cx + node_radius, cy + node_radius),
            fill=hex_rgba(BACKGROUND, 245),
            outline=hex_rgba(SECTION_FILL, 248),
            width=node_width,
        )
        centre_radius = max(1.0, 3.5 * scale)
        draw.ellipse(
            (
                cx - centre_radius,
                cy - centre_radius,
                cx + centre_radius,
                cy + centre_radius,
            ),
            fill=hex_rgba(SECTION_STROKE),
        )
    draw.ellipse(box(484), outline=hex_rgba(PAPER, 234), width=max(1, round(7 * scale)))

    if supersample > 1:
        image = image.resize((size, size), Image.Resampling.LANCZOS)
    if opaque_background:
        flattened = Image.new("RGBA", image.size, hex_rgba(PAPER))
        flattened.alpha_composite(image)
        image = flattened
    return image


def write_rasters(
    points: Sequence[tuple[float, float]],
    section: Sequence[tuple[float, float]],
    nodes: Sequence[tuple[float, float]],
    aizawa: Sequence[tuple[float, float]],
    clifford: Sequence[tuple[float, float]],
) -> list[Path]:
    targets = []
    for size in (512, 192):
        target = IMAGES / f"kenneth-computational-attractor-mark-{size}.png"
        render_raster(points, section, nodes, aizawa, clifford, size).save(
            target, optimize=True
        )
        targets.append(target)

    apple = PUBLIC / "apple-touch-icon.png"
    render_raster(
        points,
        section,
        nodes,
        aizawa,
        clifford,
        180,
        opaque_background=True,
    ).save(
        apple, optimize=True
    )
    targets.append(apple)

    favicon_png = PUBLIC / "favicon-32x32.png"
    render_raster(points, section, nodes, aizawa, clifford, 32).save(
        favicon_png, optimize=True
    )
    targets.append(favicon_png)

    favicon = PUBLIC / "favicon.ico"
    raster = render_raster(points, section, nodes, aizawa, clifford, 64)
    raster.save(favicon, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    targets.append(favicon)
    return targets


def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)
    orbit = integrate()
    projected = project(orbit)
    aizawa_orbit = integrate_aizawa()
    aizawa_projected = project_aizawa(aizawa_orbit)
    clifford_orbit = iterate_clifford()
    clifford_projected = project_clifford(clifford_orbit)
    section = poincare_section(orbit, projected)
    nodes = lobe_nodes(projected)
    outputs = [
        write_svg(
            projected,
            section,
            nodes,
            aizawa_projected,
            clifford_projected,
        ),
        *write_rasters(
            projected,
            section,
            nodes,
            aizawa_projected,
            clifford_projected,
        ),
    ]
    for output in outputs:
        print(output.relative_to(ROOT))
    print(
        f"points={len(projected)} a={HALVORSEN_A} dt={DT} "
        f"transient={TRANSIENT_STEPS} kept={KEPT_STEPS} "
        f"poincare={len(section)} aizawa={len(aizawa_projected)} "
        f"clifford={len(clifford_projected)}"
    )


if __name__ == "__main__":
    main()
