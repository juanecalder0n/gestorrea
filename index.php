<?php
require_once(__DIR__ . '/../../config.php');
require_once(__DIR__ . '/lib.php');

$idcurso = required_param('id', PARAM_INT);
$curso = get_course($idcurso);

require_login($curso);
$contexto = context_course::instance($curso->id);
require_capability('local/gestorrea:view', $contexto);

$PAGE->set_url(new moodle_url('/local/gestorrea/index.php', ['id' => $curso->id]));
$PAGE->set_pagelayout('incourse');
$PAGE->set_title(get_string('pluginname', 'local_gestorrea') . ': ' . format_string($curso->shortname));
$PAGE->set_heading(format_string($curso->fullname));
$PAGE->requires->css(new moodle_url('/local/gestorrea/estilo_gestor.css'));

echo $OUTPUT->header();

if (!local_gestorrea_curso_habilitado($curso)) {
    echo $OUTPUT->notification(get_string('cursonohabilitado', 'local_gestorrea'), 'warning');
    echo $OUTPUT->footer();
    exit;
}
?>
<div id="gestor-rea">
    <div class="encabezado">
        <div>
            <p class="nombre" id="tituloCurso"></p>
            <span class="subtitulo-grupo" id="tituloGrupo"></span>
        </div>
    </div>

    <div class="barra-herramientas">
        <div class="buscar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="buscarEstudiante" placeholder="Buscar Estudiante...">
        </div>

        <div class="organizar">
            <span class="icono">▼</span>
            <label for="ordenarPor">Organizar por:</label>
            <select id="ordenarPor">
                <option value="az">Nombre (A-Z)</option>
                <option value="za">Nombre (Z-A)</option>
                <option value="mayor">Mayor a menor REA</option>
                <option value="menor">Menor a mayor REA</option>
            </select>
        </div>

        <div class="seleccionarREA">
            <span class="icono">▼</span>
            <label for="seleccionarREA">Seleccionar REA:</label>
            <select id="seleccionarREA">
                <option value="todas">Todas las REA</option>
                <option value="1">REA 1</option>
                <option value="2">REA 2</option>
                <option value="3">REA 3</option>
            </select>
        </div>
    </div>

    <div id="listaParticipantes"></div>
</div>
<?php
$datos = [
    'ajaxurl' => (new moodle_url('/local/gestorrea/ajax.php'))->out(false),
    'sesskey' => sesskey(),
    'userid'  => (int) $USER->id,
    'curso'   => [
        'id'        => (int) $curso->id,
        'fullname'  => $curso->fullname,
        'shortname' => $curso->shortname,
        'idnumber'  => $curso->idnumber,
    ],
];
$opciones = JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;
echo html_writer::script('window.GESTOR_REA = ' . json_encode($datos, $opciones) . ';');

$version = get_config('local_gestorrea', 'version');
$archivos = [
    'config.js',
    'utilidades.js',
    'moodle-notas.js',
    'moodle-retroalimentacion.js',
    'retroalimentacion-elementos.js',
    'retroalimentacion-eventos.js',
    'app-participantes.js',
    'buscar.js',
    'organizar.js',
];
foreach ($archivos as $archivo) {
    echo html_writer::script('', new moodle_url('/local/gestorrea/js/' . $archivo, ['v' => $version]));
}
echo html_writer::script('cargarParticipantes();');

echo $OUTPUT->footer();
