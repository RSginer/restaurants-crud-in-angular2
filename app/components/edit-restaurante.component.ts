import {Component, OnInit} from "angular2/core";
import {Router, RouteParams, ROUTER_DIRECTIVES} from "angular2/router";
import {RestaurantesService} from "../services/restaurantes.service";
import {Restaurante} from "../model/restaurante";

@Component({
    selector: "edit-restaurante",
    templateUrl: "app/view/add-restaurante.html",
    providers: [RestaurantesService]
})
export class EditRestauranteComponent implements OnInit {
    public titulo = "Editar restaurante " + this._routeParams.get("id");
    public restaurante: Restaurante;
    public error;
    public loadingImagen: boolean = false;
    public imagenesParaSubir: Array<File>;
    public rutaImagen: string;

    constructor(private _restaurantesService: RestaurantesService,
        private _router: Router,
        private _routeParams: RouteParams) { }

    subirImagen(fileInput: any) {
        this.loadingImagen = true;
        this.imagenesParaSubir = <Array<File>>fileInput.target.files;
        this._restaurantesService.subirImagen(this.imagenesParaSubir[0]).then(
            result => {
                this.loadingImagen = false;
                this.restaurante.imagen = result.toString();
                this.rutaImagen = result.toString();
                console.log(result);
            },
            error => {
                this.error = <any>error;
                alert("Error al subir la imagen " + error.status);
                this.error = <any>error;
                console.error("ERROR: " + error.status);
                console.info("INFORMACION DEL ERROR");
                console.info(error._body);
            }
        );
    }

    onSubmit() {
        console.log(this.restaurante);
        this._restaurantesService.updateRestaurante(this.restaurante).subscribe(
            res => {
                this.restaurante = res;
                this._router.navigate(['Restaurante', { id: res.id }]);
            },
            error => {
                this.error = <any>error;
                this._router.navigate(['Home']);
                console.error("ERROR: " + error.status);
                console.info("INFORMACION DEL ERROR");
                console.info(error._body);
            }
        );
    }

    ngOnInit() {
        this.restaurante = new Restaurante(
            parseInt(this._routeParams.get("id")),
            null, null, null, null, null);
        this.getRestauranteById(this.restaurante.id);

    }

    getRestauranteById(id) {
        this._restaurantesService.getRestauranteById(id)
            .subscribe(
            res => {
                this.restaurante = res;
                if (this.restaurante.imagen != null) {
                    this.rutaImagen = this.restaurante.imagen;
                } else {
                    this.rutaImagen = "/assets/images/imagen-default.jpg";
                }

            },
            error => {
                this.error = <any>error;
                this._router.navigate(['Home']);
                console.error("ERROR: " + error.status);
                console.info("INFORMACION DEL ERROR");
                console.info(error._body);
            });

    }
}