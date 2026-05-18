// src/components/AlumnoCard.jsx 
const AlumnoCard = ({ nombre, carrera, estado }) => {
    // Lógica simple para cambiar el color del badge según el estado 
    const badgeColor = estado === 'Matriculado' ? 'bg-success' : 'bg-secondary';
    return (
        <div className="col-md-4 mb-3">
            <div className="card shadow-sm h-100">
                <div className="card-body">
                    <h5 className="card-title text-primary">{nombre}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{carrera}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className={`badge ${badgeColor}`}>{estado}</span>
                        <div>
                            <button className="btn btn-sm btn-outline-warning me-2">Editar</button>
                            <button className="btn btn-sm btn-outline-danger">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AlumnoCard;