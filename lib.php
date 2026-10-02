<?php
defined('MOODLE_INTERNAL') || die();

function local_gestorrea_normalizar(string $texto): string {
    $texto = core_text::specialtoascii($texto);
    $texto = core_text::strtoupper($texto);
    $texto = preg_replace('/[^A-Z0-9]+/', ' ', $texto);
    return trim($texto);
}

function local_gestorrea_numero_retro(string $nombre): ?int {
    if (preg_match('/^RETRO ?ALIMENTACION ?REA ?(\d+)$/', local_gestorrea_normalizar($nombre), $coincidencia)) {
        return (int) $coincidencia[1];
    }
    return null;
}

function local_gestorrea_curso_habilitado(stdClass $curso): bool {
    $infocurso = get_fast_modinfo($curso);
    foreach ($infocurso->get_instances_of('assign') as $modulo) {
        if (!empty($modulo->deletioninprogress)) {
            continue;
        }
        if (local_gestorrea_numero_retro($modulo->name) !== null) {
            return true;
        }
    }
    return false;
}

function local_gestorrea_extend_navigation_course(navigation_node $navegacion, stdClass $curso, context_course $contexto) {
    if (!has_capability('local/gestorrea:view', $contexto)) {
        return;
    }
    if (!local_gestorrea_curso_habilitado($curso)) {
        return;
    }
    $url = new moodle_url('/local/gestorrea/index.php', ['id' => $curso->id]);
    $navegacion->add(
        get_string('pluginname', 'local_gestorrea'),
        $url,
        navigation_node::TYPE_SETTING,
        null,
        'local_gestorrea',
        new pix_icon('i/grades', '')
    );
}
