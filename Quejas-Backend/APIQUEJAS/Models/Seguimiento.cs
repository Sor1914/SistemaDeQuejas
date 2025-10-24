using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Models
{
    public class Seguimiento
    {
     
    }

    public class EncabezadoQueja
    {
        public int Id_Encabezado { get; set; }
        public string Correlativo { get; set; }
        public DateTime Fecha { get; set; }
        public string Hora { get; set; }
        public string Detalle { get; set; }
        public string Direcccion_Archivo { get; set; }
        public string Usuario { get; set; }
        public int Id_Estado_Externo { get; set; }
        public int Id_Estado_Interno { get; set; }
        public string Justificacion { get; set; }
        public string Respuesta { get; set; }
        public int Id_Punto_Atencion { get; set; }
        public int Id_Region { get; set; }
    }

    public class DetalleQueja
    {
        public int Id_Detalle { get; set; }
        public int Id_Encabezado { get; set; }
        public string Comentario { get; set; }
        public string Direcccion_Archivo { get; set; }
        public string Id_Usuario { get; set; }
    }

}