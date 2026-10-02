<?php
define('AJAX_SCRIPT', true);
require_once(__DIR__ . '/../../config.php');

$idcurso = required_param('gestor_curso', PARAM_INT);
$funcion = required_param('gestor_fn', PARAM_ALPHANUMEXT);

$curso = get_course($idcurso);
require_login($curso, false);
require_sesskey();
require_capability('local/gestorrea:view', context_course::instance($curso->id));

header('Content-Type: application/json; charset=utf-8');

$permitidas = [
    'core_enrol_get_enrolled_users',
    'core_course_get_contents',
    'gradereport_user_get_grade_items',
    'mod_assign_get_assignments',
    'mod_assign_get_submission_status',
    'mod_assign_save_grade',
];

function local_gestorrea_responder_error(string $mensaje) {
    echo json_encode(['exception' => 'gestorrea', 'message' => $mensaje]);
    exit;
}

if (!in_array($funcion, $permitidas, true)) {
    local_gestorrea_responder_error('Función no permitida: ' . $funcion);
}

$parametros = $_POST;
unset($parametros['sesskey'], $parametros['gestor_curso'], $parametros['gestor_fn']);

if (array_key_exists('courseid', $parametros)) {
    $parametros['courseid'] = $curso->id;
}
if (array_key_exists('courseids', $parametros)) {
    $parametros['courseids'] = [$curso->id];
}
foreach (['assignid', 'assignmentid'] as $clave) {
    if (array_key_exists($clave, $parametros)
            && !$DB->record_exists('assign', ['id' => (int) $parametros[$clave], 'course' => $curso->id])) {
        local_gestorrea_responder_error('La actividad no pertenece a este curso.');
    }
}

$respuesta = \core_external\external_api::call_external_function($funcion, $parametros);

if (!empty($respuesta['error'])) {
    local_gestorrea_responder_error($respuesta['exception']->message ?: 'Error en Moodle');
}

echo json_encode($respuesta['data']);
