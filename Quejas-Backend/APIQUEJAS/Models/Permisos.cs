using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Models
{
    public class Permisos
    {
        public bool CatalogoPuntosAtencion { get; set; }
        public bool UsuarioPuntoAtencion { get; set; }

        public bool CatalogoQuejas { get; set; }
        public bool IngresoQuejasUsuario { get; set; }
        public bool IngresoQuejasCliente { get; set; }

        public bool AsignacionRechazo { get; set; }
        public bool SeguimientoCentralizador { get; set; }
        public bool SeguimientoPuntoAtencion { get; set; }
        public bool AutoConsulta { get; set; }


        public bool Reporte { get; set; }
        public bool Usuarios { get; set; }
    }
}